<?php

namespace App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAffiliateCampaignGoal extends EditRecord
{
    protected static string $resource = AffiliateCampaignGoalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
