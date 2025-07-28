<?php

namespace App\Filament\Affiliate\Resources\AffiliateMonthlyEarningResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateMonthlyEarningResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageAffiliateMonthlyEarnings extends ManageRecords
{
    protected static string $resource = AffiliateMonthlyEarningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
        ];
    }
}
