<?php

namespace App\Filament\Resources\UserEarningResource\Pages;

use App\Filament\Resources\UserEarningResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserEarning extends EditRecord
{
    protected static string $resource = UserEarningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
