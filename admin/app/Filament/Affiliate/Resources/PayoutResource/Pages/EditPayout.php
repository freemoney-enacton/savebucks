<?php

namespace App\Filament\Affiliate\Resources\PayoutResource\Pages;

use App\Filament\Affiliate\Resources\PayoutResource;
use Filament\Actions;
// use App\Filament\Actions\PaypalPayoutAction;
use App\Filament\Actions\AffPaypalPayoutAction; 
use Filament\Resources\Pages\EditRecord;

class EditPayout extends EditRecord
{
    protected static string $resource = PayoutResource::class;

    protected function getHeaderActions(): array
    {   

        $actions = [
                    Actions\DeleteAction::make(),
                    Actions\ViewAction::make(),
                ];

         //Paypal Payout Button
        if (config('services.paypal.payout_enabled') &&
            $this->record->payment_method === 'paypal') {

            if ($this->record->status == 'pending') {
                $actions[] = Actions\Action::make('initiate_payout')
                    ->label('Initiate Payout')
                    ->icon('fab-paypal')
                    ->action(fn () => AffPaypalPayoutAction::initiatePayoutRequest($this->record));
         
            } else if ($this->record->status == 'processing') {
                $actions[] = Actions\Action::make('check_status')
                    ->label('Check Status')
                    ->icon('fab-paypal')
                    ->action(fn () => AffPaypalPayoutAction::checkPayoutStatus($this->record));
            }
        }

        return $actions;
    }


}
