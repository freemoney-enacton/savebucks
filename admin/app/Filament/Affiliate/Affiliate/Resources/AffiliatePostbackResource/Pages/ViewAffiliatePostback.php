<?php

namespace App\Filament\Affiliate\Resources\AffiliatePostbackResource\Pages;

use App\Filament\Affiliate\Resources\AffiliatePostbackResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAffiliatePostback extends ViewRecord
{
    protected static string $resource = AffiliatePostbackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\EditAction::make(),
        ];
    }
}
