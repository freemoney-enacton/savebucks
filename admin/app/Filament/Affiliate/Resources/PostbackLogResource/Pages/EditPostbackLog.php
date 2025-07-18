<?php

namespace App\Filament\Affiliate\Resources\PostbackLogResource\Pages;

use App\Filament\Affiliate\Resources\PostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPostbackLog extends EditRecord
{
    protected static string $resource = PostbackLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
