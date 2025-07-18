<?php

namespace App\Filament\Resources\UserDailyBonusLadderResource\Pages;

use App\Filament\Resources\UserDailyBonusLadderResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUserDailyBonusLadders extends ListRecords
{
    protected static string $resource = UserDailyBonusLadderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
