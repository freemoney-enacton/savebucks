<?php

namespace App\Filament\Affiliate\Resources\AffiliatePostbackResource\Pages;

use App\Filament\Affiliate\Resources\AffiliatePostbackResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAffiliatePostback extends EditRecord
{
    protected static string $resource = AffiliatePostbackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            // Actions\DeleteAction::make(),
        ];
    }
}
