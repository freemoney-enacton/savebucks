<?php

namespace App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAffiliateCampaignGoal extends ViewRecord
{
    protected static string $resource = AffiliateCampaignGoalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
