<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Storage;


class CreateStore extends CreateRecord
{
    protected static string $resource = StoreResource::class;
    use CreateRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {

        if (isset($data['logo'])) {

            $filename = $data['logo'];
            $data['logo'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        if (isset($data['banner_image'])) {

            $filename = $data['banner_image'];
            $data['banner_image'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        return $data;
    }
}
