<?php

namespace App\Filament\Resources\NetworkResource\Pages;

use App\Filament\Resources\NetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditNetwork extends EditRecord
{
    protected static string $resource = NetworkResource::class;
    use EditRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['logo'])) {
            $data['logo'] = Storage::disk('frontend')->url($data['logo']);
        }
        if (isset($data['icon'])) {
            $data['icon'] = Storage::disk('frontend')->url($data['icon']);
        }
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['logo'])) {
            $data['logo'] = pathinfo(parse_url($data['logo'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        if (isset($data['icon'])) {
            $data['icon'] = pathinfo(parse_url($data['icon'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        return $data;
    }
}
