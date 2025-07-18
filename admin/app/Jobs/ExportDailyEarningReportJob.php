<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;
use App\Models\User;

class ExportDailyEarningReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;

    /**
     * Create a new job instance.
     */
    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Starting Export : DE Report & user id is ======>'. $this->userId);


            $results = DB::select('SELECT * FROM daily_earning_report ORDER BY date DESC');

            // Create a filename with timestamp to ensure uniqueness
            $filename = 'daily_earning_report_' . date('Y-m-d_His') . '.csv';

            // Store in public directory so it's directly accessible via URL
            $path = 'public/exports/' . $filename;

            // Check if exports directory exists and create it if needed
            if (!Storage::exists('public/exports')) {
                Storage::makeDirectory('public/exports');
            }

            // Open the file handle for writing
            $handle = fopen(Storage::path($path), 'w');

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
                    Log::error('Failed to export row', [
                        'row_id' => $row->id ?? 'unknown',
                        'error' => $rowException->getMessage()
                    ]);
                    $failedRows++;
                }
            }

            fclose($handle);

            // Generate notification message
            $notificationBody = 'Your daily earning report export has completed and ' .
                number_format($successfulRows) . ' ' .
                str('row')->plural($successfulRows) . ' exported.';

            if ($failedRows > 0) {
                $notificationBody .= ' ' . number_format($failedRows) . ' ' .
                    str('row')->plural($failedRows) . ' failed to export.';
            }

            // Get direct URL to the file (no controller needed)
            $fileUrl = Storage::url('exports/' . $filename);



            // Get the user who requested the export
            $user = User::find($this->userId);

            log::info("Reachedd to the part where we asked for user instance agin ====> ". $user->name);


            if ($user) {
                // Send notification with direct download URL
                Notification::make()
                    ->title('Success, CSV Export')
                    ->body($notificationBody)
                    ->success()
                    ->icon('heroicon-o-check-badge')
                    ->iconColor('success')
                    ->actions([
                        Action::make('download')
                            ->label('Download CSV')
                            ->url($fileUrl)
                            ->button()
                            ->color('success')
                            ->openUrlInNewTab()
                    ])
                    ->sendToDatabase($user);
            }

            // Success log
            Log::info('Export completed via job', [
                'user_id' => $this->userId,
                'successful_rows' => $successfulRows,
                'failed_rows' => $failedRows,
                'filename' => $filename,
                'url' => $fileUrl
            ]);
        } catch (\Throwable $e) {
            // Log any errors
            Log::error('Error in export job', [
                'user_id' => $this->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Send error notification to the user
            $user = User::find($this->userId);
            if ($user) {
                Notification::make()
                    ->title('Export Failed')
                    ->body('Failed to export: ' . $e->getMessage())
                    ->danger()
                    ->icon('heroicon-o-x-circle')
                    ->persistent()
                    ->sendToDatabase($user);
            }
        }
    }
}
