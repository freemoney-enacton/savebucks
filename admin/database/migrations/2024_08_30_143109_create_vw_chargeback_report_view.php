<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW vw_chargeback_report AS
            SELECT
                `u`.`id` AS `user_id`,
                `u`.`name` AS `name`,
                `u`.`email` AS `email`,
                COUNT(`s`.`id`) AS `total_sales_count`,
                SUM(`s`.`amount`) AS `total_amount`,
                COUNT(CASE WHEN (`s`.`is_chargeback` = 1) THEN 1 END) AS `chargeback_count`,
                SUM(CASE WHEN (`s`.`is_chargeback` = 1) THEN `s`.`amount` END) AS `chargeback_amount`,
                COUNT(CASE WHEN (`s`.`status` = 'confirmed') THEN 1 END) AS `confirmed_sales_count`,
                COUNT(CASE WHEN (`s`.`status` = 'pending') THEN 1 END) AS `pending_sales_count`,
                ((COUNT(CASE WHEN (`s`.`is_chargeback` = 1) THEN 1 END) / COUNT(`s`.`id`)) * 100) AS `chargeback_ratio`
            FROM
                `users` `u`
                JOIN `user_offerwall_sales` `s` ON (`u`.`id` = `s`.`user_id`)
            GROUP BY
                `u`.`id`,
                `u`.`name`,
                `u`.`email`
            ORDER BY
                `chargeback_count` DESC,
                `total_sales_count` DESC,
                `u`.`id` DESC
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS vw_chargeback_report");
    }
};
