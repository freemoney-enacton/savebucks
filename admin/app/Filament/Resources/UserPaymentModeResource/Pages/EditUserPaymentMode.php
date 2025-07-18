<?php

namespace App\Filament\Resources\UserPaymentModeResource\Pages;

use App\Filament\Resources\UserPaymentModeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserPaymentMode extends EditRecord
{
    protected static string $resource = UserPaymentModeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
