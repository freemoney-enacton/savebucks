<?php

namespace App\Filament\Resources\DailyEarningReportResource\Pages;

use App\Filament\Resources\DailyEarningReportResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDailyEarningReport extends EditRecord
{
    protected static string $resource = DailyEarningReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
