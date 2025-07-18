<?php

namespace App\Filament\Resources\NetworkCategoryResource\Pages;

use App\Filament\Resources\NetworkCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNetworkCategory extends EditRecord
{
    protected static string $resource = NetworkCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
