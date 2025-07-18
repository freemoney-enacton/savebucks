<?php

namespace App\Filament\Actions;

use App\Models\Affiliate\Payout;
use App\Services\AffPayPalPayoutService;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;
use App\Jobs\ProcessAffiliatePaypalPayoutRequest;
use App\Mail\AffiliatePaymentStatusMail;
use Illuminate\Support\Facades\Mail;

class AffPaypalPayoutAction
{
    public static function initiatePayoutRequest(Payout $payout): void
    {
        try {
            if (!config('services.paypal.payout_enabled')) {
                Notification::make()
                    ->warning()
                    ->title('PayPal payout is disabled')
                    ->send();
                return;
            }

            if ($payout->payment_method !== 'paypal') {
                Notification::make()
                    ->warning()
                    ->title('Invalid payment method')
                    ->body('This action is only available for PayPal payouts.')
                    ->send();
                return;
            }

            if ($payout->status !== 'pending') {
                Notification::make()
                    ->warning()
                    ->title('Invalid payout status')
                    ->body('Only payouts with "pending" status can be processed.')
                    ->send();
                return;
            }

            // Validate PayPal email from payment_account
            if (empty($payout->payment_account)) {
                Notification::make()
                    ->warning()
                    ->title('No PayPal email found')
                    ->body('Please ensure the payout has a valid PayPal email address.')
                    ->send();
                return;
            }

            if (!filter_var($payout->payment_account, FILTER_VALIDATE_EMAIL)) {
                Notification::make()
                    ->warning()
                    ->title('Invalid PayPal email')
                    ->body('Please ensure the payout has a valid PayPal email address.')
                    ->send();
                return;
            }

            // Dispatch your job here when ready
            ProcessAffiliatePaypalPayoutRequest::dispatch($payout->id);

            // Log the initiation of payout with affiliate-specific context
            Log::channel('affiliate_payouts')->info('Affiliate Payout Initiated', [
                'payout_id'         => $payout->id,
                'affiliate_id'      => $payout->affiliate_id,
                'amount'            => $payout->requested_amount,
                'payment_method'    => $payout->payment_method,
                'payment_account'   => $payout->payment_account
            ]);

            Notification::make()
                ->success()
                ->title('Payout request initiated')
                ->body('The payout request has been queued for processing.')
                ->send();

        } catch (\Exception $e) {

            // Log the error with affiliate-specific context
            Log::channel('affiliate_payouts')->error('Failed to Initiate Affiliate PayPal Payout', [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Notification::make()
                ->danger()
                ->title('Failed to initiate payout')
                ->body('An error occurred while processing your request.')
                ->send();
        }
    }

    public static function checkPayoutStatus(Payout $payout): void
    {
        try {
            if (!config('services.paypal.payout_enabled')) {
                Notification::make()
                    ->warning()
                    ->title('PayPal payout is disabled')
                    ->send();
                return;
            }

            if (empty($payout->api_reference_id)) {
                Notification::make()
                    ->warning()
                    ->title('No payout reference found')
                    ->body('This payout has not been processed through PayPal yet.')
                    ->send();
                return;
            }

            $paypalService = app(AffPayPalPayoutService::class);
            $status = $paypalService->getPayoutStatus($payout->id, $payout->api_reference_id);

            $previousStatus = $payout->status;

            $internalStatus = match($status['batch_status']) {
                'SUCCESS'   => 'paid',
                'DENIED', 'FAILED', 'RETURNED', 'REVERSED', 'CANCELED' => 'rejected',
                 default     => $payout->status
            };

            $payout->update([
                'api_response'  => $status['raw_response'],
                'api_status'    => $status['batch_status'],
                'status'        => $internalStatus,
                'paid_at'       => $status['batch_status'] === 'SUCCESS' && $status['time_completed'] ?
                    \Carbon\Carbon::parse($status['time_completed']) :
                    $payout->paid_at
            ]);


            // Send email notification if status changed
            if ($previousStatus !== $internalStatus) {
                self::sendStatusChangeEmail($payout);
            }

            // Log the status check with affiliate-specific context
            Log::channel('affiliate_payouts')->info('Action ==> :Affiliate Payout Status Checked', [
                'payout_id'         => $payout->id,
                'affiliate_id'      => $payout->affiliate_id,
                'previous_status'   => $previousStatus,
                'new_status'        => $internalStatus,
                'batch_status'      => $status['batch_status'],
                'email_sent'        => $previousStatus !== $internalStatus ? 'yes' : 'no'
            ]);

            $statusMessage = match($status['batch_status']) {
                'SUCCESS'   => 'Payout completed successfully!',
                'PENDING'   => 'Payout is still being processed.',
                'DENIED'    => 'Payout was denied by PayPal.',
                'FAILED'    => 'Payout failed to process.',
                'RETURNED'  => 'Payout was returned.',
                'REVERSED'  => 'Payout was reversed.',
                'CANCELED'  => 'Payout was canceled.',
                default     => "Current status: {$status['batch_status']}"
            };

            $notificationType = match($status['batch_status']) {
                'SUCCESS' => 'success',
                'DENIED', 'FAILED', 'RETURNED', 'REVERSED', 'CANCELED' => 'danger',
                default => 'info'
            };

            Notification::make()
                ->$notificationType()
                ->title('Status updated')
                ->body($statusMessage)
                ->send();

        } catch (\Exception $e) {

            // Log the error with affiliate-specific context
            Log::channel('affiliate_payouts')->error('Failed to Check Affiliate PayPal Payout Status', [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Notification::make()
                ->danger()
                ->title('Failed to check status')
                ->body('An error occurred while checking the status.')
                ->send();
        }
    }

    protected static function sendStatusChangeEmail(Payout $payout): void
    {
        try {
            $affiliate = $payout->affiliate;
            
            if (!$affiliate) {
                throw new \Exception('Affiliate not found for this payout');
            }

            // ENHANCED: Add email validation
            if (!$affiliate->email || !filter_var($affiliate->email, FILTER_VALIDATE_EMAIL)) {
                throw new \Exception('Invalid affiliate email address');
            }
            
            $data = [
                'affiliate_name'    => $affiliate->name,
                'payout_id'         => $payout->transaction_id,
                'amount'            => '$' . number_format($payout->requested_amount, 2),
                'status'            => $payout->status,
                'payment_method'    => $payout->payment_method,
                'paid_at'           => $payout->paid_at ? $payout->paid_at->format('M d, Y H:i A') : null,
            ];

            Mail::to($affiliate->email)->send(new AffiliatePaymentStatusMail($data));
            
            Log::channel('affiliate_payouts')->info("Payout status email sent", [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id,
                'affiliate_email' => $affiliate->email,
                'status' => $payout->status
            ]);
            
        } catch (\Exception $e) {
            Log::channel('affiliate_payouts')->error("Failed to send payout status email", [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Don't throw the exception here to avoid breaking the status check process
            // The status update should still complete even if email fails
        }
    }
}