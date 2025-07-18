<?php

namespace App\Filament\Resources\UserRefferralEarningResource\Pages;

use App\Filament\Resources\UserRefferralEarningResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;

class ManageUserRefferralEarnings extends ListRecords
{
    protected static string $resource = UserRefferralEarningResource::class;
    use ListRecords\Concerns\Translatable;

    // use ListRecord\Concerns\Translatable;


    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'pending' => Tab::make()->query(fn ($query) => $query->where('status', 'pending')),
            'confirmed' => Tab::make()->query(fn ($query) => $query->where('status', 'confirmed')),
            'declined' => Tab::make()->query(fn ($query) => $query->where('status', 'declined')),
        ];
    }
}
