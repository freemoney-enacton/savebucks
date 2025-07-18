<?php

namespace App\Jobs;

use App\Enums\PaymentStatus;
use App\Filament\Actions\PaypalPayoutAction;
use App\Models\UserPayment;
use App\Services\PayPalPayoutService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessUserPaypalPayoutRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $maxExceptions = 3;
    public $timeout = 30;

    private int $paymentId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $paymentId)
    {
        $this->paymentId = $paymentId;
    }

    /**
     * Execute the job.
     */
    public function handle(PayPalPayoutService $paypalService): void
    {
        // Check if PayPal payout is enabled
        if (!config('services.paypal.payout_enabled')) {
            Log::info('PayPal payout is disabled. Skipping payment.', [
                'payment_id' => $this->paymentId
            ]);
            return;
        }

        $payment = UserPayment::findOrFail($this->paymentId);

        // Check if payment method is PayPal
        if ($payment->payment_method_code !== 'paypal') {
            Log::info('Payment method is not PayPal. Skipping payment.', [
                'payment_id' => $this->paymentId,
                'payment_method' => $payment->payment_method_code
            ]);
            return;
        }

        try {
            // Update status to processing
            $payment->update(['status' => PaymentStatus::Processing]);

            // Create unique request ID using payment_id
            $requestId = sprintf('PAY_%s_%s', $payment->payment_id, time());

            // Get email from account column
            if (empty($payment->account)) {
                throw new \Exception('PayPal email not found in account column');
            }

            // Create payout
            $response = $paypalService->createPayout(
                paymentId: $payment->id,
                requestId: $requestId,
                email: $payment->account,
                amount: $payment->payable_amount,
                currency: 'USD', // You might want to make this configurable
                note: "Cashback payout for payment #{$payment->payment_id}"
            );

            // Get the payout batch ID
            $payoutBatchId = $response['payout_batch_id'] ?? null;

            if (!$payoutBatchId) {
                throw new \Exception('Payout batch ID not found in response');
            }

            // Get detailed status
            $payoutStatus = $paypalService->getPayoutStatus($payment->id, $payoutBatchId);

            $internalStatus = $this->mapPayPalStatusToInternal($payoutStatus['batch_status']);

            // Update payment record
            $payment->update([
                'api_reference_id' => $payoutBatchId,
                'api_response' => $response['raw_response'],
                'api_status' => $payoutStatus['batch_status'],
                'status' => $internalStatus,
                // Set paid_at timestamp if status is completed
                'paid_at' => $internalStatus === PaymentStatus::Completed ?
                    ($payoutStatus['time_completed'] ?
                        Carbon::parse($payoutStatus['time_completed']) :
                        now()
                    ) :
                    null
            ]);

            // Directly dispatch a job with a delay
            dispatch(function () use($payment) {
                PaypalPayoutAction::checkPayoutStatus($payment);
            })->delay(now()->addMinutes(1));

        } catch (\Exception $e) {
            Log::error('PayPal Payout Job Failed', [
                'payment_id' => $this->paymentId,
                'error' => $e->getMessage()
            ]);

            $payment->update([
                'api_reference_id' => $payoutBatchId ?? null,
                'api_response' => $response['raw_response'] ?? $e->getMessage(),
                'api_status' => $payoutStatus['batch_status'] ?? null,
                'status' => PaymentStatus::Processing,
                'note' => $e->getMessage(),
                'paid_at' => null
            ]);

            throw $e;
        }
    }

    /**
     * Map PayPal status to internal status
     */
    private function mapPayPalStatusToInternal(string $paypalStatus): PaymentStatus
    {
        return match ($paypalStatus) {
            'SUCCESS' => PaymentStatus::Completed,
            'DENIED', 'FAILED', 'RETURNED', 'REVERSED', 'CANCELED' => PaymentStatus::Declined,
            'PENDING', 'PROCESSING', 'NEW' => PaymentStatus::Processing,
            default => PaymentStatus::Processing
        };
    }

    /**
     * The job failed to process.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('PayPal Payout Job Failed in failed() method', [
            'payment_id' => $this->paymentId,
            'error' => $exception->getMessage()
        ]);
    }
}
