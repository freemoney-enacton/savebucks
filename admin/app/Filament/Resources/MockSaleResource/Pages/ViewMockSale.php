<?php

namespace App\Filament\Resources\MockSaleResource\Pages;

use App\Filament\Resources\MockSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewMockSale extends ViewRecord
{
    protected static string $resource = MockSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
