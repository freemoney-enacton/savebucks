<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;

class ListPages extends ListRecords
{
    protected static string $resource = PageResource::class;
    use ListRecords\Concerns\Translatable;
    use ExposesTableToWidgets;
    protected ?string $subheading = 'List of pages to display dynamically on your website.';
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
