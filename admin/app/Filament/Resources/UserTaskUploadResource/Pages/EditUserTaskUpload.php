<?php

namespace App\Filament\Resources\UserTaskUploadResource\Pages;

use App\Filament\Resources\UserTaskUploadResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserTaskUpload extends EditRecord
{
    protected static string $resource = UserTaskUploadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
