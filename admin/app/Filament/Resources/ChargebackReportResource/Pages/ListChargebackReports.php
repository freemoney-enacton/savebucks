<?php

namespace App\Filament\Resources\ChargebackReportResource\Pages;

use App\Filament\Resources\ChargebackReportResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;

class ListChargebackReports extends ListRecords
{
    protected static string $resource = ChargebackReportResource::class;

    public function getTableRecordKey(Model $record): string
    {
        return uniqid();
    }
}
