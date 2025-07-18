<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MaskClientNetwork extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mask-client-network {client_code}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mast client code from tasks';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $client_code = $this->argument('client_code');

        \DB::statement("UPDATE `offerwall_tasks` SET url = REPLACE(url,'" . $client_code . "','xxxxxx')");

        $this->line("Replaced client code: " . $client_code);
    }
}
