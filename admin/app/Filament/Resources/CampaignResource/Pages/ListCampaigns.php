<?php

namespace App\Filament\Resources\CampaignResource\Pages;

use App\Filament\Resources\CampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListCampaigns extends ListRecords
{
    protected static string $resource = CampaignResource::class;
    protected ?string $subheading = 'List of Campaigns to manage here,';

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
            'not_joined' => Tab::make()->query(fn($query) => $query->where('status', 'not_joined')),
            'joined' => Tab::make()->query(fn($query) => $query->where('status', 'joined')),
            'pending' => Tab::make()->query(fn($query) => $query->where('status', 'pending')),
            'declined' => Tab::make()->query(fn($query) => $query->where('status', 'declined')),
        ];
    }
}
