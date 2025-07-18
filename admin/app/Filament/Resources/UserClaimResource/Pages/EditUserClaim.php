<?php

namespace App\Filament\Resources\UserClaimResource\Pages;

use App\Filament\Resources\UserClaimResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserClaim extends EditRecord
{
    protected static string $resource = UserClaimResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
