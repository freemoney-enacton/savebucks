<?php

namespace App\Filament\Resources\UserStreakResource\Pages;

use App\Filament\Resources\UserStreakResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserStreak extends EditRecord
{
    protected static string $resource = UserStreakResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
