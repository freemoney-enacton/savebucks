<?php

namespace App\Filament\Resources\LoginFraudReportResource\Pages;

use App\Filament\Resources\LoginFraudReportResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;

class ListLoginFraudReports extends ListRecords
{
    protected static string $resource = LoginFraudReportResource::class;

    public function getTableRecordKey(Model $record): string
    {
        return uniqid();
    }
}
