<?php

namespace App\Filament\Resources\GiftCardPayoutResource\Pages;

use App\Enums\PaymentStatus;
use App\Filament\Actions\GiftCardPayoutAction;
use App\Filament\Actions\PaypalPayoutAction;
use App\Filament\Resources\GiftCardPayoutResource;
use Filament\Actions;
use App\Mail\PayoutPaidByAdmin;
use Filament\Resources\Pages\EditRecord;

class EditGiftCardPayout extends EditRecord
{
    protected static string $resource = GiftCardPayoutResource::class;

    protected function getHeaderActions(): array
    {
        $actions = [Actions\DeleteAction::make()];

        if ($this->record->payment_method_code === 'giftcard'
        ) {

            if ($this->record->status == PaymentStatus::Created) {
                $actions[] = Actions\Action::make('initiate_payout')
                    ->label('Initiate Payout')
                    ->icon('heroicon-o-gift')
                    ->action(fn() => GiftCardPayoutAction::initiatePayoutRequest($this->record));
            } else if ($this->record->status == PaymentStatus::Processing) {
                $actions[] = Actions\Action::make('check_status')
                    ->label('Check Status')
                    ->icon('fab-paypal')
                    ->action(fn() => GiftCardPayoutAction::checkPayoutStatus($this->record));
            }
        }

        return $actions;
    }

    protected function afterSave(): void
    {

        $user = $this->record->user;
        if (isset($this->record->getChanges()['status'])) {
            $data['user_name'] = $user->name;
            $data['payment_id'] = $this->record['payment_id'];
            $data['amount'] = formatCurrency($this->record['amount'], settings()->get('default_currency'));
            $data['paid_at'] = $this->record['status'] == 'declined' ? 'not paid' : $this->record['paid_at'];
            $data['status'] = $this->record['status'];
            $data['payment_method'] = $this->record->paymentMethod->name ?? 'manual';
            $data['user_email'] = $user->email;
            $data['message'] = $this->record['note'] ?? '-';
            \Mail::to($user->email)->send(new PayoutPaidByAdmin($data));
        }
    }
}
