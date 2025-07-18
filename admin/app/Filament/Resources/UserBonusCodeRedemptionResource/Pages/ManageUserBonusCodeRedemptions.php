<?php

namespace App\Filament\Resources\UserBonusCodeRedemptionResource\Pages;

use App\Filament\Resources\UserBonusCodeRedemptionResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageUserBonusCodeRedemptions extends ManageRecords
{
    protected static string $resource = UserBonusCodeRedemptionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
