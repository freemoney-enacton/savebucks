<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Resources\Pages\ViewRecord\Concerns\Translatable;

class ViewStore extends ViewRecord
{
    protected static string $resource = StoreResource::class;
    use Translatable;


    protected function getHeaderActions(): array
    {
        return [

            Actions\LocaleSwitcher::make(),

        ];
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
