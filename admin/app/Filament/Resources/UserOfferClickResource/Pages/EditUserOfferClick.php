<?php

namespace App\Filament\Resources\UserOfferClickResource\Pages;

use App\Filament\Resources\UserOfferClickResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserOfferClick extends EditRecord
{
    protected static string $resource = UserOfferClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
