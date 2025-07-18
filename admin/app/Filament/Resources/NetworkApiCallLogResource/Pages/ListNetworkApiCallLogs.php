<?php

namespace App\Filament\Resources\NetworkApiCallLogResource\Pages;

use App\Filament\Resources\NetworkApiCallLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNetworkApiCallLogs extends ListRecords
{
    protected static string $resource  = NetworkApiCallLogResource::class;
    protected ?string $subheading = 'Network Api Call Logs maintained here';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
