<?php

namespace App\Filament\Resources\UserReferrerSaleResource\Pages;

use App\Filament\Resources\UserReferrerSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;


class ListUserReferrerSales extends ListRecords
{
    protected static string $resource = UserReferrerSaleResource::class;
    protected ?string $subheading = 'List of User ReferrerSales to manage here,';


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
