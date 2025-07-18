<?php

namespace App\Filament\Resources\UserPaymentModeResource\Pages;

use App\Filament\Resources\UserPaymentModeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUserPaymentModes extends ListRecords
{
    protected static string $resource = UserPaymentModeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
