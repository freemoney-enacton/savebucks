<?php

namespace App\Filament\Affiliate\Resources\ConversionResource\Pages;

use App\Filament\Affiliate\Resources\ConversionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditConversion extends EditRecord
{
    protected static string $resource = ConversionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
