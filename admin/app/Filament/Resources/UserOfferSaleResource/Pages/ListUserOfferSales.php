<?php

namespace App\Filament\Resources\UserOfferSaleResource\Pages;

use App\Filament\Resources\UserOfferSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListUserOfferSales extends ListRecords
{
    protected static string $resource = UserOfferSaleResource::class;
    // use ListRecords\Concerns\Translatable;
    // protected ?string $subheading = 'List of user offer sales transactions';
    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
            // Actions\LocaleSwitcher::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'pending' => Tab::make()->query(fn ($query) => $query->where('status', 'pending')),
            'confirmed' => Tab::make()->query(fn ($query) => $query->where('status', 'confirmed')),
            'declined' => Tab::make()->query(fn ($query) => $query->where('status', 'declined')),
        ];
    }
}
