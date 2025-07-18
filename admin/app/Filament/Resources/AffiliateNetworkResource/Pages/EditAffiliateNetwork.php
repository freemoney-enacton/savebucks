<?php

namespace App\Filament\Resources\AffiliateNetworkResource\Pages;

use App\Filament\Resources\AffiliateNetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAffiliateNetwork extends EditRecord
{
    protected static string $resource = AffiliateNetworkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
