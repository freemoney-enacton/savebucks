<?php

namespace App\Filament\Resources\FrontUserResource\Pages;

use App\Enums\FrontUserStatus;
use App\Filament\Resources\FrontUserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListFrontUsers extends ListRecords
{
    protected static string $resource = FrontUserResource::class;

    protected ?string $subheading = 'List of all the registered users.';

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
            FrontUserStatus::Active->value => Tab::make()
                ->query(fn ($query) =>
                    $query->where('status', FrontUserStatus::Active)
                ),

            FrontUserStatus::Disabled->value => Tab::make()
                ->query(fn ($query) =>
                    $query->where('status', FrontUserStatus::Disabled)
                ),

            FrontUserStatus::Banned->value => Tab::make()
                ->query(fn ($query) =>
                    $query->where('status', FrontUserStatus::Banned)
                ),
        ];
    }
}
