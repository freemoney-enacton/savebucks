<?php

namespace App\Filament\Resources\NetworkRunResource\Pages;

use App\Filament\Resources\NetworkRunResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNetworkRuns extends ListRecords
{
    protected static string $resource = NetworkRunResource::class;
    protected ?string $subheading = 'List of Network Runs to manage here,';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
