<?php

namespace App\Filament\Affiliate\Resources\ViewConversionResource\Pages;

use App\Filament\Affiliate\Resources\ViewConversionResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewViewConversion extends ViewRecord
{
    protected static string $resource = ViewConversionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\EditAction::make(),
        ];
    }
}
