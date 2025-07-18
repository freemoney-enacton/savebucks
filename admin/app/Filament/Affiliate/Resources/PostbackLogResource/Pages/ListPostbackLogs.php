<?php

namespace App\Filament\Affiliate\Resources\PostbackLogResource\Pages;

use App\Filament\Affiliate\Resources\PostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListPostbackLogs extends ListRecords
{
    protected static string $resource = PostbackLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
        ];
    }

     public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'success' => Tab::make()->query(fn ($query) => $query->where('status', 'success')),
            'failure' => Tab::make()->query(fn ($query) => $query->where('status', 'failure')),
            
        ];
    }
}
