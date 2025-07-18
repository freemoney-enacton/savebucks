<?php

namespace App\Filament\Resources\AffiliateNetworkResource\Pages;

use App\Filament\Resources\AffiliateNetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateAffiliateNetwork extends CreateRecord
{
    protected static string $resource = AffiliateNetworkResource::class;
    // use CreateRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\LocaleSwitcher::make(),
            // ...
        ];
    }

    public function mutateFormDataBeforeCreate(array $data): array
    {   
        // dd($data);
        return $data;
    }
}
