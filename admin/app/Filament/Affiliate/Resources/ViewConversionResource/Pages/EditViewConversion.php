<?php

namespace App\Filament\Affiliate\Resources\ViewConversionResource\Pages;

use App\Filament\Affiliate\Resources\ViewConversionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditViewConversion extends EditRecord
{
    protected static string $resource = ViewConversionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            // Actions\DeleteAction::make(),
        ];
    }
}
