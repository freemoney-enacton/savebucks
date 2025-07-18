<?php

namespace App\Filament\Resources\ClickFraudReportResource\Pages;

use App\Filament\Resources\ClickFraudReportResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;

class ListClickFraudReports extends ListRecords
{
    protected static string $resource = ClickFraudReportResource::class;

    public function getTableRecordKey(Model $record): string
    {
        return uniqid();
    }
}
