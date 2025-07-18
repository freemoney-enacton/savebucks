<?php

namespace App\Filament\Resources\UserPaymentResource\Pages;

use App\Filament\Resources\UserPaymentResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;

class ListUserPayments extends ListRecords
{
    protected static string $resource = UserPaymentResource::class;
    protected ?string $subheading = 'List of user payments history';
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
            'created' => Tab::make()->query(fn ($query) => $query->where('status', 'created')),
            'processing' => Tab::make()->query(fn ($query) => $query->where('status', 'processing')),
            'completed' => Tab::make()->query(fn ($query) => $query->where('status', 'completed')),
            'declined' => Tab::make()->query(fn ($query) => $query->where('status', 'declined')),
        ];
    }
}
