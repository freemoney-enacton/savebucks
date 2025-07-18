<?php

namespace App\Filament\Exports;

use App\Models\Sale;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class SaleExporter extends Exporter
{
    protected static ?string $model = Sale::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('network_id'),
            ExportColumn::make('network_campaign_id'),
            ExportColumn::make('transaction_id'),
            ExportColumn::make('commission_id'),
            ExportColumn::make('order_id'),
            ExportColumn::make('click_date'),
            ExportColumn::make('sale_date'),
            ExportColumn::make('sale_amount'),
            ExportColumn::make('base_commission'),
            ExportColumn::make('commission_amount'),
            ExportColumn::make('currency'),
            ExportColumn::make('sale_status'),
            ExportColumn::make('status'),
            ExportColumn::make('sale_updated_time'),
            ExportColumn::make('aff_sub1'),
            ExportColumn::make('aff_sub2'),
            ExportColumn::make('aff_sub3'),
            ExportColumn::make('aff_sub4'),
            ExportColumn::make('aff_sub5'),
            ExportColumn::make('extra_information'),
            ExportColumn::make('found_batch_id'),
            ExportColumn::make('created_at'),
            ExportColumn::make('updated_at'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your sale export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
