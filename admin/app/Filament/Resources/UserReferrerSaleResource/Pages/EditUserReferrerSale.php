<?php

namespace App\Filament\Resources\UserReferrerSaleResource\Pages;

use App\Filament\Resources\UserReferrerSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserReferrerSale extends EditRecord
{
    protected static string $resource = UserReferrerSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
