<?php

namespace App\Filament\Resources\MenuResource\Pages;

use App\Filament\Resources\MenuResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ManageRecords;

class ManageMenus extends ManageRecords
{
    use ManageRecords\Concerns\Translatable;
    use ExposesTableToWidgets;
    protected static string $resource = MenuResource::class;

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
