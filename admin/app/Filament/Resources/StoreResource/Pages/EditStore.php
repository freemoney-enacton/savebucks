<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;


class EditStore extends EditRecord
{   
    use EditRecord\Concerns\Translatable;
    protected static string $resource = StoreResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array    {   

       
        if (isset($data['logo'])) {
            $data['logo'] = Storage::disk('frontend')->url($data['logo']);
        }
        if (isset($data['banner_image'])) {
            $data['banner_image'] = Storage::disk('frontend')->url($data['banner_image']);
        }
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
    //    dump($data);

        if (isset($data['logo'])) {
            $data['logo'] = pathinfo(parse_url($data['logo'], PHP_URL_PATH), PATHINFO_BASENAME);
            $data['logo'] = 'stores/'. $data['logo'];   
        }

        if (isset($data['banner_image'])) {
            $data['banner_image'] = pathinfo(parse_url($data['banner_image'], PHP_URL_PATH), PATHINFO_BASENAME);
            $data['banner_image'] = 'stores/' . $data['banner_image'];
        }

        // dump($data);
        return $data;
    }
}
