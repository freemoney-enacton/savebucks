<?php

namespace App\Filament\Resources\BannerResource\Pages;

use App\Filament\Resources\BannerResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBanner extends EditRecord
{
    protected static string $resource = BannerResource::class;
    use EditRecord\Concerns\Translatable;
    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    // protected function mutateFormDataBeforeSave(array $data): array
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
