<?php

namespace App\Filament\Resources\UserOfferClickResource\Pages;

use App\Filament\Resources\UserOfferClickResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUserOfferClicks extends ListRecords
{
    protected static string $resource = UserOfferClickResource::class;
    protected ?string $subheading = 'List of user offer clicks';
    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
        ];
    }
}
