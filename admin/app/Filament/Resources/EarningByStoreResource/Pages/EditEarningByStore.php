<?php

namespace App\Filament\Resources\EarningByStoreResource\Pages;

use App\Filament\Resources\EarningByStoreResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditEarningByStore extends EditRecord
{
    protected static string $resource = EarningByStoreResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
