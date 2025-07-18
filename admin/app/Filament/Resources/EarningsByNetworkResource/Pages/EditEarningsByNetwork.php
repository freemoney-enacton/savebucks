<?php

namespace App\Filament\Resources\EarningsByNetworkResource\Pages;

use App\Filament\Resources\EarningsByNetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditEarningsByNetwork extends EditRecord
{
    protected static string $resource = EarningsByNetworkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
