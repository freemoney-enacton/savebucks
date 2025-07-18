<?php

namespace App\Filament\Resources\PostbackLogResource\Pages;

use App\Filament\Resources\PostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListPostbackLogs extends ListRecords
{
    protected static string $resource = PostbackLogResource::class;
    protected ?string $subheading = 'Postback Logs for offers and surveys.';

    public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'pending' => Tab::make()->query(fn ($query) => $query->where('status', 'pending')),
            'processed' => Tab::make()->query(fn ($query) => $query->where('status', 'processed')),
            'error' => Tab::make()->query(fn ($query) => $query->where('status', 'error')),
        ];
    }
}
