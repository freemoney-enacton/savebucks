<?php

namespace App\Filament\Resources\AffiliatePostbackLogResource\Pages;

use App\Filament\Resources\AffiliatePostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAffiliatePostbackLog extends EditRecord
{
    protected static string $resource = AffiliatePostbackLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
