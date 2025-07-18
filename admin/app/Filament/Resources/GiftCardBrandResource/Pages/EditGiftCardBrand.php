<?php

namespace App\Filament\Resources\GiftCardBrandResource\Pages;

use App\Filament\Resources\GiftCardBrandResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditGiftCardBrand extends EditRecord
{
    use EditRecord\Concerns\Translatable;
    protected static string $resource = GiftCardBrandResource::class;

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
        // dd($data['image']);
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
    //    dump($data);

        if (isset($data['image'])) {
            $data['image'] = pathinfo(parse_url($data['image'], PHP_URL_PATH), PATHINFO_BASENAME);
            $data['image'] = "gift-card/tango/".$data['image'];
        }

        // dump($data);
        return $data;
    }
}
