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
            CREATE VIEW vw_click_frauds AS
            SELECT
                `u`.`id` AS `user_id`,
                `u`.`name` AS `name`,
                `u`.`email` AS `email`,
                COUNT(`utc`.`id`) AS `total_clicks_count`,
                COUNT(DISTINCT `utc`.`id`) AS `distinct_clicks_count`,
                GROUP_CONCAT(DISTINCT `utc`.`ip` ORDER BY `utc`.`ip` ASC SEPARATOR ', ') AS `clicked_ips`,
                COUNT(DISTINCT `utc`.`ip`) AS `distinct_ip_count`
            FROM
                `users` `u`
                JOIN `user_task_clicks` `utc` ON (`u`.`id` = `utc`.`user_id`)
            GROUP BY
                `u`.`id`,
                `u`.`name`,
                `u`.`email`
            ORDER BY
                `distinct_ip_count` DESC,
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
        DB::statement("DROP VIEW IF EXISTS vw_click_frauds");
    }
};
