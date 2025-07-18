<?php

namespace App\Filament\Resources\PaymentTypeResource\Pages;

use App\Filament\Resources\PaymentTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePaymentType extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = PaymentTypeResource::class;
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['image'])) {
            $filename = $data['image'];
            $data['image'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        if (isset($data['icon'])) {
            $filename = $data['icon'];
            $data['icon'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }
}
