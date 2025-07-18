<?php

namespace App\Filament\Resources\UserBonusResource\Pages;

use App\Filament\Resources\UserBonusResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserBonus extends EditRecord
{
    protected static string $resource = UserBonusResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
