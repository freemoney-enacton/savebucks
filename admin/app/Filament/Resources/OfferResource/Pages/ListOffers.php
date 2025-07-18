<?php

namespace App\Filament\Resources\OfferResource\Pages;

use App\Filament\Resources\OfferResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListOffers extends ListRecords
{
    protected static string $resource = OfferResource::class;
    protected ?string $subheading = 'List of offers to manage here, please confirm before delete or edit any offer record';
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
            null => Tab::make('All'),
            'draft' => Tab::make()->query(fn ($query) => $query->where('status', 'draft')),
            'publish' => Tab::make()->query(fn ($query) => $query->where('status', 'publish')),
            'trash' => Tab::make()->query(fn ($query) => $query->where('status', 'trash')),
        ];
    }
}
