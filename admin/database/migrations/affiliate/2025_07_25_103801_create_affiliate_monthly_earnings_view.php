<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        
        // Drop view if it exists
        DB::statement('DROP VIEW IF EXISTS affiliate_monthly_earnings');
        
        if ($driver === 'mysql') {
            $this->createMySQLView();
        } elseif ($driver === 'pgsql') {
            $this->createPostgreSQLView();
        } else {
            throw new \Exception("Unsupported database driver: {$driver}. Only MySQL and PostgreSQL are supported.");
        }
    }

    /**
     * Create MySQL version of the view
     */
    private function createMySQLView(): void
    {
        $sql = "
            CREATE VIEW `affiliate_monthly_earnings` AS 
            SELECT 
                ROW_NUMBER() OVER (
                    ORDER BY `conversions`.`affiliate_id`,
                             DATE_FORMAT(`conversions`.`converted_at`,'%Y-%m'),
                             `conversions`.`status`
                ) AS `id`,
                `conversions`.`affiliate_id` AS `affiliate_id`,
                DATE_FORMAT(`conversions`.`converted_at`,'%Y-%m') AS `month`,
                `conversions`.`status` AS `status`,
                SUM(`conversions`.`commission`) AS `total_earning`,
                COUNT(*) AS `transaction_count` 
            FROM `conversions` 
            WHERE `conversions`.`converted_at` IS NOT NULL 
            GROUP BY 
                `conversions`.`affiliate_id`,
                DATE_FORMAT(`conversions`.`converted_at`,'%Y-%m'),
                `conversions`.`status` 
            ORDER BY 
                `conversions`.`affiliate_id`,
                DATE_FORMAT(`conversions`.`converted_at`,'%Y-%m'),
                `conversions`.`status`
        ";
        
        DB::statement($sql);
    }

    /**
     * Create PostgreSQL version of the view
     */
    private function createPostgreSQLView(): void
    {
        $sql = "
            CREATE VIEW affiliate_monthly_earnings AS 
            SELECT 
                ROW_NUMBER() OVER (
                    ORDER BY conversions.affiliate_id,
                             TO_CHAR(conversions.converted_at,'YYYY-MM'),
                             conversions.status
                ) AS id,
                conversions.affiliate_id AS affiliate_id,
                TO_CHAR(conversions.converted_at,'YYYY-MM') AS month,
                conversions.status AS status,
                SUM(conversions.commission) AS total_earning,
                COUNT(*) AS transaction_count 
            FROM conversions 
            WHERE conversions.converted_at IS NOT NULL 
            GROUP BY 
                conversions.affiliate_id,
                TO_CHAR(conversions.converted_at,'YYYY-MM'),
                conversions.status 
            ORDER BY 
                conversions.affiliate_id,
                TO_CHAR(conversions.converted_at,'YYYY-MM'),
                conversions.status
        ";
        
        DB::statement($sql);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS affiliate_monthly_earnings');
    }
};