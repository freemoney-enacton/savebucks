<?php

namespace App\Filament\Affiliate\Resources\ClickResource\Pages;

use App\Filament\Affiliate\Resources\ClickResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewClick extends ViewRecord
{
    protected static string $resource = ClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
