<?php

namespace App\Console\Commands;

use App\Enums\PaymentStatus;
use Illuminate\Console\Command;
use App\Models\GiftCardPayout;
use App\Filament\Actions\GiftCardPayoutAction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;


class ProcessTangoAutoPayouts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tango:process-auto-payouts {--limit= : Maximum number of payouts to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process Tango gift card auto payouts for created requests';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Auto Payout ===> Starting Tango auto payout processing... at ' . now()->format('Y-m-d H:i:s'));
        Log::info("Auto Payout ===> Starting Tango auto payout processing... at". now()->format('Y-m-d H:i:s'));

        // Check if auto payout is enabled
        $autoPayoutEnabled = config('freemoney.default.tango_auto_payout_enabled', false);

        if (!$autoPayoutEnabled) {
            $this->info('Tango auto payout is disabled in settings. Exiting...');
            Log::info('Auto Payout ===> Tango auto payout command executed but auto payout is disabled in settings');
            return 0;
        }

        $limit = $this->option('limit');

        // Get created gift card payout requests
        $query  = GiftCardPayout::where('payment_method_code', 'giftcard')
            ->where('status', PaymentStatus::Created)
            ->orderBy('created_at', 'asc');        
           
        // Apply limit only if provided
        if ($limit) {
            $query->limit($limit);
        }

        // Get the payout requests
        $payouts = $query->get();

        if ($payouts->isEmpty()) {
            $this->info('No pending Tango gift card payouts found.');
            Log::info('Auto Payout ===> Tango auto payout command executed - no pending payouts found');
            return 0;
        }

        $this->info("Found {$payouts->count()} pending payout(s) to process.");
        Log::info("Auto Payout ===> Tango auto payout command started - processing {$payouts->count()} payout(s)");

        $processed = 0;
        $failed = 0;

        // Process each payout
        foreach ($payouts as $payout) {
            try {
                DB::transaction(function () use ($payout) {
                    $this->info("Processing: {$payout->payment_id}");

                    // Lock and verify status
                    $current = GiftCardPayout::lockForUpdate()->find($payout->id);
                    if (!$current || $current->status !== PaymentStatus::Created) {
                        $this->warn("Skipping {$payout->payment_id} - status changed");
                        return;
                    }

                    // Process payout
                    GiftCardPayoutAction::initiatePayoutRequest($current);
                    $this->info("✓ Success: {$payout->payment_id}");
                });

                $processed++;

            } catch (Exception $e) {
                $failed++;
                $this->error("✗ Failed: {$payout->payment_id} - {$e->getMessage()}");

                Log::error('Auto Payout ===> Tango payout failed', [
                    'payout_id' => $payout->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        
        $this->info("Completed. Processed: {$processed}, Failed: {$failed}");
        return 0;
    }
}
