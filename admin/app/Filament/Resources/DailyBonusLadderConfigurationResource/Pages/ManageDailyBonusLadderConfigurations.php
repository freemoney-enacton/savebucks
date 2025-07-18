<?php

namespace App\Filament\Resources\DailyBonusLadderConfigurationResource\Pages;

use App\Filament\Resources\DailyBonusLadderConfigurationResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageDailyBonusLadderConfigurations extends ManageRecords
{
    protected static string $resource = DailyBonusLadderConfigurationResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
