<?php

namespace App\Filament\Resources\GiftCardPayoutResource\Pages;

use App\Filament\Resources\GiftCardPayoutResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListGiftCardPayouts extends ListRecords
{
    protected static string $resource = GiftCardPayoutResource::class;
    protected ?string $subheading = 'List of user gift card payout history';


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
            'created' => Tab::make()->query(fn($query) => $query->where('status', 'created')),
            'processing' => Tab::make()->query(fn($query) => $query->where('status', 'processing')),
            'completed' => Tab::make()->query(fn($query) => $query->where('status', 'completed')),
            'declined' => Tab::make()->query(fn($query) => $query->where('status', 'declined')),
        ];
    }
}
