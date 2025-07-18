<?php

namespace App\Filament\Resources\TierResource\Pages;

use App\Filament\Resources\TierResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateTier extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = TierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }
}
