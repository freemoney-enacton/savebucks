<?php

namespace App\Filament\Resources\StreakConfigurationResource\Pages;

use App\Filament\Resources\StreakConfigurationResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageStreakConfigurations extends ManageRecords
{
    protected static string $resource = StreakConfigurationResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
