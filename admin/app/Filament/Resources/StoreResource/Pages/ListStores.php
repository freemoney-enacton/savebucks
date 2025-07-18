<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListStores extends ListRecords
{
    protected static string $resource = StoreResource::class;
    protected ?string $subheading = "Stores List to manage here";

    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [

            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),

        ];
    }

    public function getTabs(): array
    {
        return [
            null        => Tab::make('All'),
            'draft'     => Tab::make()->query(fn($query) => $query->where('status', 'draft')),
            'publish'   => Tab::make()->query(fn($query) => $query->where('status', 'publish')),
            'trash'     => Tab::make()->query(fn($query) => $query->where('status', 'trash')),
        ];
    }
}
