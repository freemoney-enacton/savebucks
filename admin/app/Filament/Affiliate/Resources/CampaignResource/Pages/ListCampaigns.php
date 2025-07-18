<?php

namespace App\Filament\Affiliate\Resources\CampaignResource\Pages;

use App\Filament\Affiliate\Resources\CampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListCampaigns extends ListRecords
{
    protected static string $resource = CampaignResource::class;

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
            'active' => Tab::make()->query(fn ($query) => $query->where('status', 'active')),
            'paused' => Tab::make()->query(fn ($query) => $query->where('status', 'paused')),
            'ended' => Tab::make()->query(fn ($query) => $query->where('status', 'ended')),        
        ];
    }
}
