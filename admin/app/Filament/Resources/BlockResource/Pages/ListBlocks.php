<?php

namespace App\Filament\Resources\BlockResource\Pages;

use App\Filament\Resources\BlockResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Filament\Pages\Concerns\ExposesTableToWidgets;

class ListBlocks extends ListRecords
{
    use ExposesTableToWidgets;
    protected static string $resource = BlockResource::class;
    use ListRecords\Concerns\Translatable;
    protected ?string $subheading = 'List of all blocks to be displayed on the website';
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
