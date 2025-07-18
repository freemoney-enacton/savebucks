<?php

namespace App\Filament\Actions;

use App\Enums\PaymentStatus;
use App\Jobs\ProcessUserPaypalPayoutRequest;
use App\Models\UserPayment;
use App\Services\PayPalPayoutService;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;

class PaypalPayoutAction
{
    public static function initiatePayoutRequest(UserPayment $payment): void
    {
        try {
            if (!config('services.paypal.payout_enabled')) {
                Notification::make()
                    ->warning()
                    ->title('PayPal payout is disabled')
                    ->send();
                return;
            }

            if ($payment->payment_method_code !== 'paypal') {
                Notification::make()
                    ->warning()
                    ->title('Invalid payment method')
                    ->body('This action is only available for PayPal payments.')
                    ->send();
                return;
            }

            if ($payment->status !== PaymentStatus::Created) {
                Notification::make()
                    ->warning()
                    ->title('Invalid payment status')
                    ->body('Only payments with "created" status can be processed.')
                    ->send();
                return;
            }

            ProcessUserPaypalPayoutRequest::dispatch($payment->id);

            Notification::make()
                ->success()
                ->title('Payout request initiated')
                ->body('The payout request has been queued for processing.')
                ->send();

        } catch (\Exception $e) {
            Log::error('Failed to initiate PayPal payout', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            Notification::make()
                ->danger()
                ->title('Failed to initiate payout')
                ->body('An error occurred while processing your request.')
                ->send();
        }
    }

    public static function checkPayoutStatus(UserPayment $payment): void
    {
        try {
            if (!config('services.paypal.payout_enabled')) {
                Notification::make()
                    ->warning()
                    ->title('PayPal payout is disabled')
                    ->send();
                return;
            }

            if (empty($payment->api_reference_id)) {
                Notification::make()
                    ->warning()
                    ->title('No payout reference found')
                    ->body('This payment has not been processed through PayPal yet.')
                    ->send();
                return;
            }

            $paypalService = app(PayPalPayoutService::class);
            $status = $paypalService->getPayoutStatus($payment->id, $payment->api_reference_id);

            $internalStatus = match($status['batch_status']) {
                'SUCCESS' => PaymentStatus::Completed,
                'DENIED', 'FAILED', 'RETURNED', 'REVERSED', 'CANCELED' => PaymentStatus::Declined,
                default => $payment->status
            };

            $payment->update([
                'api_status' => $status['batch_status'],
                'api_response' => $status['raw_response'],
                'status' => $internalStatus,
                'paid_at' => $status['batch_status'] === 'SUCCESS' && $status['time_completed'] ?
                    \Carbon\Carbon::parse($status['time_completed']) :
                    $payment->paid_at
            ]);

            Notification::make()
                ->success()
                ->title('Status updated')
                ->body("Current status: {$status['batch_status']}")
                ->send();

        } catch (\Exception $e) {
            Log::error('Failed to check PayPal payout status', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            Notification::make()
                ->danger()
                ->title('Failed to check status')
                ->body('An error occurred while checking the status.')
                ->send();
        }
    }
}
