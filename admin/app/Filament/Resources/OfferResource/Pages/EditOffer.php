<?php

namespace App\Filament\Resources\OfferResource\Pages;

use App\Filament\Resources\OfferResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class EditOffer extends EditRecord
{
    protected static string $resource = OfferResource::class;
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
        if (isset($data['image'])) {
            $data['image'] = Storage::disk('frontend')->url($data['image']);
        }
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {

        if (isset($data['image'])) {
            $data['image'] = pathinfo(parse_url($data['image'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        return $data;
    }
}
