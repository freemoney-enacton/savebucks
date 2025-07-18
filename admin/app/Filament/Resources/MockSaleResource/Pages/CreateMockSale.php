<?php

namespace App\Filament\Resources\MockSaleResource\Pages;

use App\Filament\Resources\MockSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateMockSale extends CreateRecord
{
    protected static string $resource = MockSaleResource::class;
    
    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
