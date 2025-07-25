<?php

namespace App\Filament\Exports;

use App\Models\EarningByStore;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class EarningByStoreExporter extends Exporter
{
    protected static ?string $model = EarningByStore::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('name'),
            ExportColumn::make('homepage'),
            ExportColumn::make('visits'),
            ExportColumn::make('offers_count'),
            ExportColumn::make('status'),
            ExportColumn::make('total_sales'),
            ExportColumn::make('total_commission'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {   
        $body = 'Your earning by store export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
