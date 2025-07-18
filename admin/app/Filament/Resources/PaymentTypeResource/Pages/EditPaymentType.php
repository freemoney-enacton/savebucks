<?php

namespace App\Filament\Resources\PaymentTypeResource\Pages;

use App\Filament\Resources\PaymentTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Arr;

class EditPaymentType extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = PaymentTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // $this->getSaveFormAction()
            //     ->formId('form'),
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // added this loop for the removing livewire keys from payment_inputs Builder block
        // when you store into the different language.
        if (!empty($data['payment_inputs'])) {
            $payment_inputs = [];
            foreach ($data['payment_inputs'] as $value) {
                $payment_inputs[] = $value;
            }
            $data['payment_inputs'] = $payment_inputs;
        }

        if (isset($data['image'])) {
            $filename = $data['image'];
            $data['image'] =   \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        if (isset($data['icon'])) {
            $filename = $data['icon'];
            $data['icon'] =   \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {   
        // dd($data);
        if (isset($data['image'])) {
            $data['image'] = pathinfo(parse_url($data['image'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        if (isset($data['icon'])) {
            $data['icon'] = pathinfo(parse_url($data['icon'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        // dd($data);
        return $data;
    }
}
