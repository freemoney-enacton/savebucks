<?php

namespace App\Filament\Affiliate\Resources\PostbackLogResource\Pages;

use App\Filament\Affiliate\Resources\PostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPostbackLog extends ViewRecord
{
    protected static string $resource = PostbackLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\EditAction::make(),
        ];
    }
}
