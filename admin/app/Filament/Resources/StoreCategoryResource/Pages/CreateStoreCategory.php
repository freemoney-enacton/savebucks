<?php

namespace App\Filament\Resources\StoreCategoryResource\Pages;

use App\Filament\Resources\StoreCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateStoreCategory extends CreateRecord
{
    protected static string $resource = StoreCategoryResource::class;
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

        if (isset($data['icon'])) {

            $filename = $data['icon'];
            $data['icon'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        if (isset($data['header_image'])) {

            $filename = $data['header_image'];
            $data['header_image'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        return $data;
    }
}
