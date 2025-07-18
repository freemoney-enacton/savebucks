<?php

namespace App\Filament\Resources\GiftCardPayoutResource\Pages;

use App\Filament\Resources\GiftCardPayoutResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewGiftCardPayout extends ViewRecord
{
    protected static string $resource = GiftCardPayoutResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
