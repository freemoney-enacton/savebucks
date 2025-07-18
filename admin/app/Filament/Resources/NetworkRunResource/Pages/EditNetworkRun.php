<?php

namespace App\Filament\Resources\NetworkRunResource\Pages;

use App\Filament\Resources\NetworkRunResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNetworkRun extends EditRecord
{
    protected static string $resource = NetworkRunResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
