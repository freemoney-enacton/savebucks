<?php

namespace App\Filament\Affiliate\Resources\AffiliateCampaignResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateCampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAffiliateCampaigns extends ListRecords
{
    protected static string $resource = AffiliateCampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
