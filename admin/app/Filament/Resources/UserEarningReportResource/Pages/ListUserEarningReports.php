<?php

namespace App\Filament\Resources\UserEarningReportResource\Pages;

use App\Filament\Resources\UserEarningReportResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;

class ListUserEarningReports extends ListRecords
{
    protected static string $resource = UserEarningReportResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getTableRecordKey(Model $record): string
    {
        return 'user_id';
    }
}
