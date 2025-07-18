<?php

namespace App\Filament\Resources\TierResource\Pages;

use App\Filament\Resources\TierResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTiers extends ListRecords
{
    use ListRecords\Concerns\Translatable;

    protected static string $resource = TierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

}
