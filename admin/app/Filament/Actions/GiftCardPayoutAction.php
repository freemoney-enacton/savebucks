<?php

namespace App\Filament\Actions;

use App\Enums\PaymentStatus;
use App\Models\UserPayment;
use EnactOn\ProCashBee\JobEvents\Jobs\TangoCardOrderJob;
use EnactOn\ProCashBee\JobEvents\Jobs\TangoStatus​Query​Job;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;

class GiftCardPayoutAction
{
    public static function initiatePayoutRequest($payment): void
    {
        try {
           

            if ($payment->payment_method_code !== 'giftcard') {
                Notification::make()
                    ->warning()
                    ->title('Invalid payment method')
                    ->body('This action is only available for GiftCard payments.')
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

            Log::info("Job dispatchedd in action");
            dispatch_sync(new TangoCardOrderJob($payment));

            Notification::make()
                ->success()
                ->title('Payout request initiated')
                ->body('The payout request has been queued for processing.')
                ->send();

        } catch (\Exception $e) {
            Log::error('Failed to initiate GiftCard payout', [
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
          

            if (empty($payment->api_reference_id)) {
                Notification::make()
                    ->warning()
                    ->title('No payout reference found')
                    ->body('This payment has not been processed through GiftCard yet.')
                    ->send();
                return;
            }

            dispatch(new TangoStatus​Query​Job($payment));

            Notification::make()
                ->success()
                ->title('Payout status request initiated')
                ->body('The payout status request has been queued for processing.')
                ->send();

        } catch (\Exception $e) {
            Log::error('Failed to check GiftCard payout status', [
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
