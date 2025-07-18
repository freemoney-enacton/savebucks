<?php

namespace App\Filament\Affiliate\Resources\PayoutResource\Pages;

use App\Filament\Affiliate\Resources\PayoutResource;
use Filament\Actions;
// use App\Filament\Actions\PaypalPayoutAction;
use App\Filament\Actions\AffPaypalPayoutAction; 
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;
use App\Mail\AffiliatePaymentStatusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EditPayout extends EditRecord
{
    protected static string $resource = PayoutResource::class;

    protected function getHeaderActions(): array
    {   

        $actions = [
                    // Actions\DeleteAction::make(),
                    Actions\ViewAction::make(),
                ];

         //Paypal Payout Button
        if (config('services.paypal.payout_enabled') &&
            $this->record->payment_method === 'paypal') {

            if ($this->record->status == 'pending') {
                $actions[] = Actions\Action::make('initiate_payout')
                    ->label('Initiate Payout')
                    ->icon('fab-paypal')
                    ->action(function () {
                        if (!$this->checkPayPalConfigurationAndNotify()) {
                            return;
                        }                        
                        AffPaypalPayoutAction::initiatePayoutRequest($this->record);
                    });
        
            } else if ($this->record->status == 'processing') {
                $actions[] = Actions\Action::make('check_status')
                    ->label('Check Status')
                    ->icon('fab-paypal')
                    ->action(function () {
                        if (!$this->checkPayPalConfigurationAndNotify()) {
                            return;
                        }                            
                        AffPaypalPayoutAction::checkPayoutStatus($this->record);
                    });
            }          
        }

        //resend email 
        if ($this->record->payment_method === 'paypal' && !in_array($this->record->status, ['rejected', 'pending']) && 
            $this->record->affiliate?->email) {

            $actions[] = Actions\Action::make('resend_email')
                ->label('Resend Status Email')
                ->icon('heroicon-o-envelope')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Resend Payout Status Email')
                ->modalDescription('This will resend the payout status email to ' . $this->record->affiliate->email)
                ->modalSubmitActionLabel('Yes, resend email')
                ->action(function () {
                    try {
                        $this->sendStatusChangeEmail();
                        
                        Notification::make()
                            ->title('Email sent successfully')
                            ->body('Payout status email has been resent to ' . $this->record->affiliate->email)
                            ->success()
                            ->send();
                            
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('Failed to send email')
                            ->body('Oops! Error occurred while sending email. Please try again.')
                            ->danger()
                            ->send();
                    }
                });


        }

        return $actions;
    }

    private function isPayPalConfigured(): bool
    {
        return !empty(config('services.paypal.client_id')) && 
               !empty(config('services.paypal.client_secret'));
    }

    private function checkPayPalConfigurationAndNotify(): bool
    {
        if (!$this->isPayPalConfigured()) {
            Notification::make()
                ->warning()
                ->title('PayPal is not configured')
                ->body('Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to use this feature.')
                ->send();
            return false;
        }
        
        return true;
    }


    protected function sendStatusChangeEmail(): void
    {
        try {
            
            $affiliate = $this->record->affiliate;

            $currencySymbol = (config('freemoney.default.default_currency') == 'usd') ? '$' : '$';
            
            if (!$affiliate) {
                throw new \Exception('Affiliate not found for this payout');
            }
            
            $data = [
                'affiliate_name'    => $affiliate->name,
                'payout_id'         => $this->record->transaction_id,
                // 'amount'            => '$' . number_format($this->record->requested_amount, 2),
                'amount'            => $currencySymbol . number_format($this->record->requested_amount, 2),
                'status'            => $this->record->status,
                'payment_method'    => $this->record->payment_method,
                'paid_at'           => $this->record->paid_at ? $this->record->paid_at->format('M d, Y H:i A') : null,
            ];

            Mail::to($affiliate->email)->send(new AffiliatePaymentStatusMail($data));
            
            Log::info("Payout status email sent to: {$affiliate->email}");
            
        } catch (\Exception $e) {
            Log::error("Failed to send payout email for payout: {$this->record->id}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Called after a record is saved.
     *
     * @return void
     */
    protected function afterSave(): void
    {
        if (isset($this->record->getChanges()['status'])) {
            $this->sendStatusChangeEmail();
        }
        // Always reload after any save
       $this->redirect(PayoutResource::getUrl('edit', ['record' => $this->record]));
    }


}
