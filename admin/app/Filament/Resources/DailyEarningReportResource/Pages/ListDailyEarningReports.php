<?php

namespace App\Filament\Resources\DailyEarningReportResource\Pages;

use App\Filament\Resources\DailyEarningReportResource;
use Filament\Actions;
use App\Filament\Exports\DailyEarningReportExporter;
use App\Jobs\ProcessDailyEarningReportExport;
use App\Jobs\DailyEarningReportJob;
use Filament\Actions\Exports\Enums\ExportFormat;
use Filament\Actions\ExportAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\Exports\Models\Export;
use Filament\Actions\Action;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use App\Jobs\ExportDailyEarningReportJob;

class ListDailyEarningReports extends ListRecords
{
    protected static string $resource = DailyEarningReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
            Action::make('exportDirectly')
                ->label('Export CSV')
                ->color('warning')
                ->button()
                ->action(function () {
                    return $this->exportDailyEarningReportsDirectly();
                }),
                // ->action(function () {

                //     $userId = auth()->id();
                //     log::info("Auth User ================>" . $userId);
                //     ExportDailyEarningReportJob::dispatch($userId);

                //     Notification::make()
                //         ->title('Export Started')
                //         ->body('Your export has been queued and will be available shortly.')
                //         ->info()
                //         ->icon('heroicon-o-clock')
                //         ->send();

                //     return null;
                // }),


            // ExportAction::make()
            //     ->exporter(DailyEarningReportExporter::class)
            //     ->label("Export CSV")
            //     ->color('warning')
            //     ->formats([
            //         ExportFormat::Csv,
            //         // ExportFormat::Xlsx,
            //     ])
        ];
    }

    protected function exportDailyEarningReportsDirectly()
    {
        try {
            // Log the start of the export
            Log::info('Starting direct export of daily_earning_report');

            // Query the database directly using DB facade
            $results = DB::select('SELECT * FROM daily_earning_report ORDER BY date DESC');

            // Create a temporary file to store the CSV
            $filename = 'exports/daily_earning_report_' . date('Y-m-d_His') . '.csv';

            // Check if exports directory exists and create it if needed
            if (!Storage::exists('exports')) {
                Storage::makeDirectory('exports');
            }

            // Open the file handle for writing
            $handle = fopen(Storage::path($filename), 'w');

            // Add header row to CSV
            fputcsv($handle, [
                'ID',
                'Date',
                'Sales Revenue',
                'Task Revenue',
                'Total Revenue',
                'Task Cashback',
                'Store Cashback',
                'Bonus',
                'Referral',
                'Total Cashback',
                'Total Bonus',
                'Net Profit',
            ]);

            // Track success and failure counts
            $successfulRows = 0;
            $failedRows = 0;

            // Add data rows to CSV
            foreach ($results as $row) {
                try {
                    fputcsv($handle, [
                        $row->id ?? '',
                        $row->date ? date('Y-m-d H:i:s', strtotime($row->date)) : '',
                        $row->sales_revenue ?? 0,
                        $row->task_revenue ?? 0,
                        $row->total_revenue ?? 0,
                        $row->task_cashback ?? 0,
                        $row->store_cashback ?? 0,
                        $row->bonus ?? 0,
                        $row->referral ?? 0,
                        $row->total_cashback ?? 0,
                        $row->total_bonus ?? 0,
                        $row->net_profit ?? 0,
                    ]);
                    $successfulRows++;
                } catch (\Throwable $rowException) {
                    // Log row failure
                    Log::error('Failed to export row', [
                        'row_id' => $row->id ?? 'unknown',
                        'error' => $rowException->getMessage()
                    ]);
                    $failedRows++;
                }
            }

            // Close the file handle
            fclose($handle);

            // Generate notification message similar to original getCompletedNotificationBody
            $notificationBody = 'Your daily earning report export has completed and ' . 
                                number_format($successfulRows) . ' ' . 
                                str('row')->plural($successfulRows) . ' exported.';

            if ($failedRows > 0) {
                $notificationBody .= ' ' . number_format($failedRows) . ' ' . 
                                    str('row')->plural($failedRows) . ' failed to export.';
            }

            // Show notification with the result
            // Notification::make()
            //     ->title('Export Completed')
            //     ->body($notificationBody)
            //     ->success()
            //     ->send();

            // Log success
            Log::info('Export completed', [
                'successful_rows' => $successfulRows,
                'failed_rows' => $failedRows,
                'filename' => $filename
            ]);

            // Return the file download response
            return response()->download(
                Storage::path($filename),
                'daily_earning_report_' . date('Y-m-d_His') . '.csv',
                [
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => 'attachment; filename="daily_earning_report_' . date('Y-m-d_His') . '.csv"',
                ]
            )->deleteFileAfterSend();

        } catch (\Throwable $e) {
            // Log any errors
            Log::error('Error in direct export', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Show a notification
            Notification::make()
                ->title('Export Failed')
                ->body('Failed to export: ' . $e->getMessage())
                ->danger()
                ->persistent()
                ->send();

            // Return back to the previous page
            return back();
        }
    }

}
