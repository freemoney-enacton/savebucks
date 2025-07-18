<?php

namespace App\Filament\Resources\UserSaleResource\Pages;

use App\Filament\Resources\UserSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserSale extends EditRecord
{
    protected static string $resource = UserSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
