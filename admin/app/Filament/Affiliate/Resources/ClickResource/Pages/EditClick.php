<?php

namespace App\Filament\Affiliate\Resources\ClickResource\Pages;

use App\Filament\Affiliate\Resources\ClickResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditClick extends EditRecord
{
    protected static string $resource = ClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
