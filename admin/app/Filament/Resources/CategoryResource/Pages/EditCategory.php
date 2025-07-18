<?php

namespace App\Filament\Resources\CategoryResource\Pages;

use App\Filament\Resources\CategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCategory extends EditRecord
{
    protected static string $resource = CategoryResource::class;
    use EditRecord\Concerns\Translatable;
    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['icon'])) {
            $data['icon'] = pathinfo(parse_url($data['icon'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['icon'])) {
            $filename = $data['icon'];
            $data['icon'] =   \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        return $data;
    }
}
