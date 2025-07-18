<?php

namespace App\Filament\Resources\UserChatMessagesResource\Pages;

use App\Filament\Resources\UserChatMessagesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserChatMessages extends EditRecord
{
    protected static string $resource = UserChatMessagesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
