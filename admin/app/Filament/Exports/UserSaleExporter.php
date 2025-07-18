<?php

namespace App\Filament\Exports;

use App\Models\UserSale;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class UserSaleExporter extends Exporter
{
    protected static ?string $model = UserSale::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('user_id'),
            ExportColumn::make('sales_id'),
            ExportColumn::make('network_id'),
            ExportColumn::make('order_id'),
            ExportColumn::make('store_id'),
            ExportColumn::make('click_id'),
            ExportColumn::make('click_code'),
            ExportColumn::make('order_amount'),
            ExportColumn::make('cashback'),
            ExportColumn::make('cashback_type'),
            ExportColumn::make('currency'),
            ExportColumn::make('status'),
            ExportColumn::make('transaction_time'),
            ExportColumn::make('expected_date'),
            ExportColumn::make('mail_sent'),
            ExportColumn::make('lock_status'),
            ExportColumn::make('lock_amount'),
            ExportColumn::make('note'),
            ExportColumn::make('admin_note'),
            ExportColumn::make('created_at'),
            ExportColumn::make('updated_at'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your user sale export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
