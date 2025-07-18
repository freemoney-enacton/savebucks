<?php

namespace App\Filament\Resources\GiftCardBrandResource\Pages;

use App\Filament\Resources\GiftCardBrandResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateGiftCardBrand extends CreateRecord
{   
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = GiftCardBrandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {

        if (isset($data['image'])) {

            $filename = $data['image'];
            $data['image'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        return $data;
    }
}
