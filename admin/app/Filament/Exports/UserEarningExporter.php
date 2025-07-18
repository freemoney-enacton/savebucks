<?php

namespace App\Filament\Exports;

use App\Models\UserEarning;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class UserEarningExporter extends Exporter
{
    protected static ?string $model = UserEarning::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('user_id'),
            ExportColumn::make('name'),
            ExportColumn::make('email'),
            ExportColumn::make('provider_type'),
            ExportColumn::make('phone_no'),
            ExportColumn::make('active'),
            ExportColumn::make('banned'),
            ExportColumn::make('lang'),
            ExportColumn::make('pending_cashback'),
            ExportColumn::make('confirmed_cashback'),
            ExportColumn::make('declined_cashback'),
            ExportColumn::make('available_cashback'),
            ExportColumn::make('pending_bonus'),
            ExportColumn::make('confirmed_bonus'),
            ExportColumn::make('declined_bonus'),
            ExportColumn::make('available_bonus'),
            ExportColumn::make('pending_referral'),
            ExportColumn::make('confirmed_referral'),
            ExportColumn::make('declined_referral'),
            ExportColumn::make('available_referral'),
            ExportColumn::make('paid_cashback'),
            ExportColumn::make('paid_total'),
            ExportColumn::make('paid_reward'),
        ];
    }

    public function getFileName(Export $export): string
    {
        return 'user_cashback_earnings';
    }


    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your user earning export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
