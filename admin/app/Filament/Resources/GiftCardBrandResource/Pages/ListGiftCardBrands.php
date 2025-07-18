<?php

namespace App\Filament\Resources\GiftCardBrandResource\Pages;

use App\Filament\Resources\GiftCardBrandResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListGiftCardBrands extends ListRecords
{
    protected static string $resource = GiftCardBrandResource::class;
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
