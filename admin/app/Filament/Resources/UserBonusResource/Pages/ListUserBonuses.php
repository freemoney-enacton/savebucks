<?php

namespace App\Filament\Resources\UserBonusResource\Pages;

use App\Filament\Resources\UserBonusResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListUserBonuses extends ListRecords
{
    protected static string $resource = UserBonusResource::class;
    protected ?string $subheading = 'List of User Bonuses which has been used by users.';
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
            'pending' => Tab::make()->query(fn ($query) => $query->where('status', 'pending')),
            'confirmed' => Tab::make()->query(fn ($query) => $query->where('status', 'confirmed')),
            'declined' => Tab::make()->query(fn ($query) => $query->where('status', 'declined')),
            'expired' => Tab::make()->query(fn ($query) => $query->where('status', 'expired')),
        ];
    }
}
