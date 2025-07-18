<?php

namespace App\Filament\Resources\MockSaleResource\Pages;

use App\Filament\Resources\MockSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMockSale extends EditRecord
{
    protected static string $resource = MockSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
