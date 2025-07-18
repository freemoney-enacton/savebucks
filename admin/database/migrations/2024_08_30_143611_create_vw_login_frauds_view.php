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
            CREATE VIEW vw_login_frauds AS
            SELECT
                `t`.`joinee_user_id` AS `joinee_user_id`,
                `t`.`joinee_email` AS `joinee_email`,
                `t`.`referrer_user_id` AS `referrer_user_id`,
                `t`.`referer_email` AS `referer_email`,
                COUNT(`t`.`ip_address`) AS `ip_match`,
                GROUP_CONCAT(DISTINCT `t`.`ip_address` SEPARATOR ',') AS `ips`
            FROM (
                SELECT
                    `j`.`id` AS `joinee_user_id`,
                    `j`.`email` AS `joinee_email`,
                    `r`.`id` AS `referrer_user_id`,
                    `r`.`email` AS `referer_email`,
                    `j`.`signup_ip` AS `ip_address`
                FROM
                    `users` `j`
                    JOIN `users` `r` ON (`j`.`referrer_code` = `r`.`referral_code`)
                    JOIN `auth_logs` `jl` ON (`j`.`id` = `jl`.`id`)
                    JOIN `auth_logs` `rl` ON (`r`.`id` = `rl`.`id`)
                WHERE
                    `jl`.`ip` = `rl`.`ip`
                    AND `jl`.`ip` <> ''
            ) `t`
            GROUP BY
                `t`.`joinee_user_id`,
                `t`.`joinee_email`,
                `t`.`referrer_user_id`,
                `t`.`referer_email`
            ORDER BY
                `ip_match` DESC,
                `t`.`joinee_user_id` DESC
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS vw_login_frauds");
    }
};
