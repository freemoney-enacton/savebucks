<?php

namespace App\Filament\Resources\StoreCategoryResource\Pages;

use App\Filament\Resources\StoreCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;


class EditStoreCategory extends EditRecord
{
    protected static string $resource = StoreCategoryResource::class;
    use EditRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['icon'])) {
            $data['icon'] = Storage::disk('frontend')->url($data['icon']);
        }
        if (isset($data['header_image'])) {
            $data['header_image'] = Storage::disk('frontend')->url($data['header_image']);
        }
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {


        if (isset($data['icon'])) {
            $data['icon'] = pathinfo(parse_url($data['icon'], PHP_URL_PATH), PATHINFO_BASENAME);
            $data['icon'] = 'stores/' . $data['icon'];
        }

        if (isset($data['header_image'])) {
            $data['header_image'] = pathinfo(parse_url($data['header_image'], PHP_URL_PATH), PATHINFO_BASENAME);
            $data['icon'] = 'stores/' . $data['header_image'];
        }
        return $data;
    }
}
