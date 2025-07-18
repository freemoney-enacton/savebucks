<?php

namespace App\Filament\Resources\StoreCategoryResource\Pages;

use App\Filament\Resources\StoreCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStoreCategories extends ListRecords
{
    protected static string $resource = StoreCategoryResource::class;
    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    // public function getTabs(): array
    // {
    //     return [
    //         null => Tab::make('All'),
    //         'draft' => Tab::make()->query(fn ($query) => $query->where('status', 'draft')),
    //         'publish' => Tab::make()->query(fn ($query) => $query->where('status', 'publish')),
    //         'trash' => Tab::make()->query(fn ($query) => $query->where('status', 'trash')),
    //     ];
    // }
}
