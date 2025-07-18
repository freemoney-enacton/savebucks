<?php

namespace App\Filament\Resources\UserEarningReportResource\Pages;

use App\Filament\Resources\UserEarningReportResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUserEarningReport extends EditRecord
{
    protected static string $resource = UserEarningReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
