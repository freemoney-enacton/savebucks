<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AffiliateProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
         // Load migrations from custom directory
        $this->loadMigrationsFrom([
            
            database_path('migrations/affiliate'), // Custom folder
        ]);
    }
}
