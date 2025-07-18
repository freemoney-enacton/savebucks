<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';
    
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection('affiliate')->getDriverName();

        if ($driver === 'mysql') {
            $this->updateMysqlColumn();
        } elseif ($driver === 'pgsql') {
            $this->updatePostgresColumn();
        }
    }

    /**
     * Update MySQL column
     */
    private function updateMysqlColumn(): void
    {
        // Clean existing data - remove trailing spaces
        DB::connection('affiliate')->statement("UPDATE campaign_goals SET tracking_code = TRIM(tracking_code) WHERE tracking_code IS NOT NULL");

        // Change column from CHAR(255) to VARCHAR(255)
        DB::connection('affiliate')->statement('ALTER TABLE campaign_goals MODIFY COLUMN tracking_code VARCHAR(255)');
    }

    /**
     * Update PostgreSQL column
     */
    private function updatePostgresColumn(): void
    {
        // Clean existing data - remove trailing spaces
        DB::connection('affiliate')->statement("UPDATE campaign_goals SET tracking_code = TRIM(tracking_code) WHERE tracking_code IS NOT NULL");

        // Change column from CHARACTER(255) to VARCHAR(255)
        DB::connection('affiliate')->statement('ALTER TABLE campaign_goals ALTER COLUMN tracking_code TYPE VARCHAR(255)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection('affiliate')->getDriverName();

        if ($driver === 'mysql') {
            // Revert back to CHAR(255) - will pad with spaces again
            DB::connection('affiliate')->statement('ALTER TABLE campaign_goals MODIFY COLUMN tracking_code CHAR(255)');
        } elseif ($driver === 'pgsql') {
            // Revert back to CHARACTER(255) - will pad with spaces again
            DB::connection('affiliate')->statement('ALTER TABLE campaign_goals ALTER COLUMN tracking_code TYPE CHARACTER(255)');
        }
    }
};
