<?php

namespace App\Filament\Resources\NetworkCategoryResource\Pages;

use App\Filament\Resources\NetworkCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNetworkCategories extends ListRecords
{
    protected static string $resource = NetworkCategoryResource::class;
    protected ?string $subheading = 'List of network categories manage here';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
