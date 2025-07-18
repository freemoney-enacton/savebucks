<?php

namespace App\Filament\Exports;

use App\Models\EarningsByNetwork;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class EarningsByNetworkExporter extends Exporter
{
    protected static ?string $model = EarningsByNetwork::class;

    public static function getColumns(): array
    {
        Log::info("Exporting EarningsByNetworkExporter");
        return [
            ExportColumn::make('id')->label('ID'),
            ExportColumn::make('name'),
            ExportColumn::make('affiliate_id'),
            ExportColumn::make('total_sales'),
            ExportColumn::make('total_commission'),
        ];
    }

    public function getFileName(Export $export): string
    {
        return 'Earnings_by_Network';
    }

    public static function getCompletedNotificationBody(Export $export): string
    {

        $body = 'Your earnings by network export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
