<?php

namespace App\Filament\Resources\UserSaleResource\Pages;

use App\Filament\Resources\UserSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;


class ListUserSales extends ListRecords
{
    protected static string $resource = UserSaleResource::class;
    protected ?string $subheading = 'List of User Sales to manage here,';

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
            'confirmed' => Tab::make()->query(fn($query) => $query->where('status', 'confirmed')),
            'pending' => Tab::make()->query(fn($query) => $query->where('status', 'pending')),
            'declined' => Tab::make()->query(fn($query) => $query->where('status', 'declined')),
        ];
    }
}
