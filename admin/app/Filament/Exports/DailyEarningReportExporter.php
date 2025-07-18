<?php

namespace App\Filament\Exports;

use App\Models\DailyEarningReport;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Filament\Notifications\Notification;

class DailyEarningReportExporter extends Exporter
{
    protected static ?string $model = DailyEarningReport::class;

    protected function getTableName(): string
    {
        return 'daily_earning_report';
    }
    
    public function getBuilder(): Builder
    {
        $query = parent::getBuilder();
        
        // Log the query being built for debugging
        Log::info('Export query', [
            'query' => $query->toSql(),
            'bindings' => $query->getBindings(),
        ]);
        
        return $query;
    }

    public static function getColumns(): array
    {
        return [
            // ExportColumn::make('id'),
            ExportColumn::make('date')
                ->formatStateUsing(fn ($state) => $state?->format('Y-m-d H:i:s')),
            ExportColumn::make('sales_revenue'),
            ExportColumn::make('task_revenue'),
            ExportColumn::make('total_revenue'),
            ExportColumn::make('task_cashback'),
            ExportColumn::make('store_cashback'),
            ExportColumn::make('bonus'),
            ExportColumn::make('referral'),
            ExportColumn::make('total_cashback'),
            ExportColumn::make('total_bonus'),
            ExportColumn::make('net_profit'),
        ];
    }


    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your daily earning report export has completed and ' . number_format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }


    public static function handleFailedRow(\Filament\Actions\Exports\Models\Export $export, array $row, \Throwable $exception): void
    {
        // Log the error with more details
        Log::error('Export failed row', [
            'export_id' => $export->id,
            'row' => $row,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
        
        // Show notification in Filament
        Notification::make()
            ->title('Export Failed')
            ->body('A row failed to export: ' . $exception->getMessage())
            ->danger()
            ->persistent() // stays until manually dismissed
            ->send();
    }
    

}
