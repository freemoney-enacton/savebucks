<?php

namespace App\Filament\Affiliate\Resources\ViewConversionResource\Pages;

use App\Filament\Affiliate\Resources\ViewConversionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListViewConversions extends ListRecords
{
    protected static string $resource = ViewConversionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
        ];
    }
}
