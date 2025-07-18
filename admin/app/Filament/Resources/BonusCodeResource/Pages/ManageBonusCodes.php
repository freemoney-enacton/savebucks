<?php

namespace App\Filament\Resources\BonusCodeResource\Pages;

use App\Filament\Resources\BonusCodeResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageBonusCodes extends ManageRecords
{
    use ManageRecords\Concerns\Translatable;
    protected static string $resource = BonusCodeResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
