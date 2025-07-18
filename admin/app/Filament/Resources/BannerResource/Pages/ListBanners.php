<?php

namespace App\Filament\Resources\BannerResource\Pages;

use App\Filament\Resources\BannerResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;

class ListBanners extends ListRecords
{
    protected static string $resource = BannerResource::class;
    use ListRecords\Concerns\Translatable;
    use ExposesTableToWidgets;
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
            'draft' => Tab::make()->query(fn ($query) => $query->where('status', 'draft')),
            'publish' => Tab::make()->query(fn ($query) => $query->where('status', 'publish')),
            'trash' => Tab::make()->query(fn ($query) => $query->where('status', 'trash')),
        ];
    }
}
