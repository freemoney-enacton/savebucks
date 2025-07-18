<?php

namespace App\Filament\Resources\UserChatMessagesResource\Pages;

use App\Filament\Resources\UserChatMessagesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUserChatMessages extends ListRecords
{
    protected static string $resource = UserChatMessagesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
