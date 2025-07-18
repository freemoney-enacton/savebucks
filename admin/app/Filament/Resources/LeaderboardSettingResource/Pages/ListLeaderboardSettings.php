<?php

namespace App\Filament\Resources\LeaderboardSettingResource\Pages;

use App\Filament\Resources\LeaderboardSettingResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLeaderboardSettings extends ListRecords
{
    protected static string $resource = LeaderboardSettingResource::class;
    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
