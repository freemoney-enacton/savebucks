<?php

namespace App\Filament\Resources\MockSaleResource\Pages;

use App\Filament\Resources\MockSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;


class ListMockSales extends ListRecords
{
    protected static string $resource = MockSaleResource::class;
    // protected ?string $subheading = 'List of manual sales imports to manage here,';
    protected ?string $subheading = "This module is useful when you're working with a network that is NOT integrated with API or postback.";

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'confirmed' => Tab::make()->query(fn($query) => $query->where('status', 'confirmed')),
            'pending' => Tab::make()->query(fn($query) => $query->where('status', 'pending')),
            'declined' => Tab::make()->query(fn($query) => $query->where('status', 'declined')),
        ];
    }
}
