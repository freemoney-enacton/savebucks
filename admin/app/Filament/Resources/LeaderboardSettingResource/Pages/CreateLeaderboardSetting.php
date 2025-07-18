<?php

namespace App\Filament\Resources\LeaderboardSettingResource\Pages;

use App\Filament\Resources\LeaderboardSettingResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateLeaderboardSetting extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;

    protected static string $resource = LeaderboardSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
        ];
    }
}
