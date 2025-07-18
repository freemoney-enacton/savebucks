<?php

namespace App\Filament\Resources\UserClaimResource\Pages;

use App\Filament\Resources\UserClaimResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListUserClaims extends ListRecords
{
    protected static string $resource = UserClaimResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null            => Tab::make('All'),
            'open'          => Tab::make()->query(fn($query) => $query->where('status', 'open')),
            'hold'          => Tab::make()->query(fn($query) => $query->where('status', 'hold')),
            'answered'      => Tab::make()->query(fn($query) => $query->where('status', 'answered')),
            'closed'        => Tab::make()->query(fn($query) => $query->where('status', 'closed')),
        ];
    }
}
