<?php

namespace App\Filament\Affiliate\Resources\AffiliateReportResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateReportResource;
use Filament\Resources\Pages\ManageRecords;

class ManageAffiliateReports extends ManageRecords
{
    protected static string $resource = AffiliateReportResource::class;

    public function getTableRecordKey($record): string
    {
        if (isset($record->record_key)) {
            return (string) $record->record_key;
        }
        
        return $record->affiliate_id . '-' . $record->month_year;
    }
}
