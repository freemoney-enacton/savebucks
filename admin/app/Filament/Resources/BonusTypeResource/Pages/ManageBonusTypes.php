<?php

namespace App\Filament\Resources\BonusTypeResource\Pages;

use App\Filament\Resources\BonusTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageBonusTypes extends ManageRecords
{
    use ManageRecords\Concerns\Translatable;
    protected static string $resource = BonusTypeResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
