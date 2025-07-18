<?php

namespace App\Jobs;

use App\Filament\Actions\AffPaypalPayoutAction;
use App\Models\Affiliate\Payout;
use App\Services\AffPayPalPayoutService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Mail\AffiliatePaymentStatusMail;
use Illuminate\Support\Facades\Mail;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;
use App\Filament\Affiliate\Resources\PayoutResource;

class ProcessAffiliatePaypalPayoutRequest  implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $maxExceptions = 3;
    public $timeout = 30;

    private int $payoutId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $payoutId)
    {
        $this->payoutId  = $payoutId;
    }

    /**
     * Execute the job.
     */
    public function handle(AffPayPalPayoutService  $paypalService): void
    {
        // Check if PayPal payout is enabled
        if (!config('services.paypal.payout_enabled')) {
            Log::channel('affiliate_payouts')->info('Job : PayPal payout is disabled. Skipping affiliate payout.', [
                'payout_id' => $this->payoutId
            ]);
            return;
        }

        $payout = Payout::findOrFail($this->payoutId);

        // Check if payment method is PayPal
        if ($payout->payment_method !== 'paypal') {
            Log::channel('affiliate_payouts')->info('Job : Payment method is not PayPal. Skipping affiliate payout.', [
                'payout_id' => $this->payoutId,
                'payment_method' => $payout->payment_method
            ]);
            return;
        }

        $response = null;
        $payoutStatus = null;
        $payoutBatchId = null;

        try {
            // Update status to processing
            $payout->update(['status' => 'processing']);

            // Create unique request ID using payment_id
            $requestId = sprintf('AFF_%s_%s', $payout->id, time());

            // Get PayPal email from payment_account column
            if (empty($payout->payment_account)) {
                throw new \Exception('PayPal email not found in payment_account column');
            }

            // Create payout
            $response = $paypalService->createPayout(
                payoutId    : $payout->id,
                requestId   : $requestId,
                email       : $payout->payment_account,
                amount      : $payout->requested_amount,
                currency    : config('services.paypal.currency', 'USD'),
                note        : "Affiliate commission payout for affiliate #{$payout->affiliate_id}"
            );

            // Get the payout batch ID
            $payoutBatchId = $response['payout_batch_id'] ?? null;

            if (!$payoutBatchId) {
                throw new \Exception('Payout batch ID not found in response');
            }

            // Get detailed status
            $payoutStatus = $paypalService->getPayoutStatus($payout->id, $payoutBatchId);

            $internalStatus = $this->mapPayPalStatusToInternal($payoutStatus['batch_status']);

            // Update payout record
            $payout->update([
                'api_reference_id'  => $payoutBatchId,
                'api_response'      => $response['raw_response'],
                'api_status'        => $payoutStatus['batch_status'],
                'status'            => $internalStatus,
                // Set paid_at timestamp if status is paid
                'paid_at'           => $internalStatus === 'paid' ?
                                    ($payoutStatus['time_completed'] ?
                                        Carbon::parse($payoutStatus['time_completed']) :
                                        now()
                                    ) :
                                    null
            ]);

            Log::channel('affiliate_payouts')->info('Job : Affiliate PayPal Payout Created Successfully', [
                'payout_id'         => $payout->id,
                'affiliate_id'      => $payout->affiliate_id,
                'api_reference_id'  => $payoutBatchId,
                'batch_status'      => $payoutStatus['batch_status']
            ]);

            // Send initial status email to affiliate
            $this->sendPayoutStatusEmail($payout);

            //Send Notification to admin
            $this->sendAffiliateNotification($payout, 'success');

            // Directly dispatch a job with a delay to check status
            dispatch(function () use($payout) {

                Log::channel('affiliate_payouts')->info('Delayed Job : Status check job started', [
                    'payout_id' => $payout->id,
                    'affiliate_id' => $payout->affiliate_id
                ]);

                AffPaypalPayoutAction::checkPayoutStatus($payout);

                Log::channel('affiliate_payouts')->info('Delayed Job : Status check job completed', [
                    'payout_id' => $payout->id,
                    'affiliate_id' => $payout->affiliate_id
                ]);

            })->delay(now()->addMinutes(1));

            Log::channel('affiliate_payouts')->info('Job : Status check job dispatched successfully', [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id
            ]);

        } catch (\Exception $e) {

            Log::channel('affiliate_payouts')->error('Job : Affiliate PayPal Payout Job Failed', [
                'payout_id'     => $this->payoutId,
                'affiliate_id'  => $payout->affiliate_id,
                'error'         => $e->getMessage()
            ]);

            $apiResponse = null;
            
            if ($response && isset($response['raw_response'])) {
                $apiResponse = $response['raw_response'];
            } else {
                // Create a structured error response
                $apiResponse = [
                    'error' => true,
                    'message' => $e->getMessage(),
                    'timestamp' => now()->toISOString(),
                    'error_type' => get_class($e)
                ];
            }

            $payout->update([
                'api_reference_id'  => $payoutBatchId ?? null,
                'api_response'      => $apiResponse,
                'api_status'        => $payoutStatus['batch_status'] ?? null,
                'status'            => 'pending', // Reset to pending for retry
                'admin_notes'       => $e->getMessage(),
                'paid_at'           => null
            ]);

            $this->sendAffiliateNotification($payout, 'failed', $e->getMessage());

            throw $e;
        }
    }

    /**
     * Map PayPal status to internal status
     */
    private function mapPayPalStatusToInternal(string $paypalStatus): string
    {
        return match ($paypalStatus) {
            'SUCCESS' => 'paid',
            'DENIED', 'FAILED', 'RETURNED', 'REVERSED', 'CANCELED' => 'rejected',
            'PENDING', 'PROCESSING', 'NEW' => 'processing',
            default => 'processing'
        };
    }


    /**
     * Send payout status email to affiliate
     */
    protected function sendPayoutStatusEmail(Payout $payout): void
    {
        try {
            
            if (!$payout->affiliate?->email) return;

            $currencySymbol = (config('freemoney.default.default_currency') == 'usd') ? '$' : '$';
        
            Mail::to($payout->affiliate->email)->send(new AffiliatePaymentStatusMail([
                'affiliate_name'    => $payout->affiliate->name,
                'payout_id'         => $payout->transaction_id,
                'amount'            => $currencySymbol . number_format($payout->requested_amount, 2),
                'status'            => $payout->status,
                'payment_method'    => $payout->payment_method,
                'paid_at'           => $payout->paid_at?->format('M d, Y H:i A'),
            ]));
            
            Log::channel('affiliate_payouts')->info('Job : Payout status email sent successfully for '. $payout->transaction_id.' to ' . $payout->affiliate->email .' status is ' . $payout->status);
            
        } catch (\Exception $e) {

            Log::channel('affiliate_payouts')->error('Job : Failed to send payout status email', [
                'payout_id'     => $payout->id,
                'affiliate_id'  => $payout->affiliate_id,
                'error'         => $e->getMessage(),
                'trace'         => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send notification to affiliate managers
     */
    private function sendAffiliateNotification(Payout $payout, string $type, string $reason = null): void
    {
        try {
            $affiliateRoles = \Spatie\Permission\Models\Role::where('name', 'LIKE', 'affiliate%')->pluck('name');
            $recipients = $affiliateRoles->isNotEmpty() ? \App\Models\User::role($affiliateRoles->toArray())->get() : collect();
            
            if ($recipients->isEmpty()) return;

            $isSuccess = $type === 'success';
            $title = $isSuccess ? 'Affiliate PayPal Payout Processed' : 'Affiliate PayPal Payout Failed';
            $body = $isSuccess 
                ? "PayPal payout processed for {$payout->affiliate->name}, Transaction: #{$payout->transaction_id}"
                : "PayPal payout failed for {$payout->affiliate->name}, Transaction: #{$payout->transaction_id}. Reason: {$reason}";

            Notification::make()
                ->title($title)
                ->body($body)
                ->{$isSuccess ? 'success' : 'danger'}()
                ->icon($isSuccess ? 'heroicon-o-banknotes' : 'heroicon-o-exclamation-circle')
                ->persistent()
                ->actions([
                    Action::make('View Payout')
                        ->url(PayoutResource::getUrl('edit', ['record' => $payout]))
                        ->button()
                        ->color($isSuccess ? 'success' : 'danger')
                ])
                ->sendToDatabase($recipients);

        } catch (\Exception $e) {

            Log::channel('affiliate_payouts')->error('Job : Failed to send notification', [
                'payout_id' => $payout->id, 'error' => $e->getMessage()
            ]);
        }
    }


    /**
     * The job failed to process.
     */
    public function failed(\Throwable $exception): void
    {
        Log::channel('affiliate_payouts')->error('Job : Affiliate PayPal Payout Job Failed in failed() method', [
            'payout_id' => $this->payoutId,
            'error' => $exception->getMessage()
        ]);

        $payout = Payout::find($this->payoutId);

        if ($payout) {
            // Create a structured error response for the failed job
            $errorResponse = [
                'error'         => true,
                'message'       => $exception->getMessage(),
                'timestamp'     => now()->toISOString(),
                'error_type'    => get_class($exception),
                'failed_after_attempts' => $this->tries
            ];

            $payout->update([
                'status'        => 'rejected',
                'api_response'  => $errorResponse,
                'api_status'    => 'FAILED',
                'admin_notes'   => 'PayPal payout failed after ' . $this->tries . ' attempts: ' . $exception->getMessage()
            ]);
        }
    }
}
