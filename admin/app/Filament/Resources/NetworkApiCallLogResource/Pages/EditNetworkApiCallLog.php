<?php

namespace App\Filament\Resources\NetworkApiCallLogResource\Pages;

use App\Filament\Resources\NetworkApiCallLogResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNetworkApiCallLog extends EditRecord
{
    protected static string $resource = NetworkApiCallLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
