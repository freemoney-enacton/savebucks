<?php

namespace App\Filament\Resources\BannerResource\Pages;

use App\Filament\Resources\BannerResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateBanner extends CreateRecord
{
    protected static string $resource = BannerResource::class;
    use CreateRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }
    // protected function mutateFormDataBeforeCreate(array $data): array
    // {
    //     if (isset($data['desktop_img'])) {
    //         $filename = $data['desktop_img'];
    //         $data['desktop_img'] =  \Illuminate\Support\Facades\Storage::disk('public')->url($filename);
    //     }
    //     if (isset($data['mobile_img'])) {
    //         $filename = $data['mobile_img'];
    //         $data['mobile_img'] =  \Illuminate\Support\Facades\Storage::disk('public')->url($filename);
    //     }
    //     return $data;
    // }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
