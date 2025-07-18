<?php

namespace App\Filament\Resources\CategoryResource\Pages;

use App\Filament\Resources\CategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    protected static string $resource = CategoryResource::class;
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
        if (isset($data['banner_img'])) {
            $filename = $data['banner_img'];
            $data['banner_img'] =   \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        return $data;
    }
}
