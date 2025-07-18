<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;


class ListSales extends ListRecords
{
    protected static string $resource = SaleResource::class;

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

                'pending'   => Tab::make()->query(fn ($query) => $query->where('status', 'pending')),
                'confirmed' => Tab::make()->query(fn ($query) => $query->where('status', 'confirmed')),
                'delayed'   => Tab::make()->query(fn ($query) => $query->where('status', 'delayed')),
                'declined'  => Tab::make()->query(fn ($query) => $query->where('status', 'declined')),

        ];
    }
}
