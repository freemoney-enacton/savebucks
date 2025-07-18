<?php

namespace App\Filament\Resources\NetworkResource\Pages;

use App\Filament\Resources\NetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use ListRecords\Concerns\Translatable;

class ListNetworks extends ListRecords
{
    protected static string $resource = NetworkResource::class;
    protected ?string $subheading = 'List of network providers used for fetching offers and survays';
    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
