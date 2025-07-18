<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('CheckUserOfferSales:sendUserSummaryEmail')->daily();

        $schedule->command('tango:process-auto-payouts')
            // ->daily()
            ->dailyAt('02:00')  
            ->withoutOverlapping(10)
            ->runInBackground()           
            ->appendOutputTo(storage_path('logs/tango_auto_payouts.log'));

        $schedule->command('tango:import-brands')
            ->dailyAt('03:00')  
            ->withoutOverlapping(10) 
            ->runInBackground()
            ->appendOutputTo(storage_path('logs/tango_import.log'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
