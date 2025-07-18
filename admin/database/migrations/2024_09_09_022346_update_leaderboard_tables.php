<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("RENAME TABLE `leaderboards` TO `leaderboard_runs`;");
        DB::statement("RENAME TABLE `leader_board_configurations` TO `leaderboard_settings`;");
        DB::statement("ALTER TABLE `leaderboard_entries` CHANGE `id` `id` BIGINT UNSIGNED NOT NULL auto_increment FIRST, CHANGE `leaderboard_id` `leaderboard_id` BIGINT UNSIGNED NOT NULL AFTER `id`, CHANGE `rank` `rank` INT NOT NULL AFTER `leaderboard_id`, CHANGE `user_id` `user_id` BIGINT UNSIGNED NOT NULL AFTER `rank`, CHANGE `earnings` `earnings` DECIMAL(10,8) NOT NULL DEFAULT '0.00000000' AFTER `user_id`, CHANGE `reward` `reward` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL AFTER `earnings`, CHANGE `status` `status` ENUM('pending','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending' AFTER `reward`;");
        DB::statement("ALTER TABLE `leaderboard_entries` CHANGE `user_id` `user_id` BIGINT UNSIGNED NULL;");
        DB::statement("ALTER TABLE `leaderboard_entries` ADD UNIQUE(`leaderboard_id`, `rank`, `user_id`);");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("RENAME TABLE `leaderboard_runs` TO `leaderboards`;");
        DB::statement("RENAME TABLE `leaderboard_settings` TO `leader_board_configurations`;");
        DB::statement("ALTER TABLE `leaderboard_entries` CHANGE `id` `id` BIGINT UNSIGNED NOT NULL auto_increment FIRST, CHANGE `leaderboard_id` `leaderboard_id` BIGINT UNSIGNED NOT NULL AFTER `id`, CHANGE `rank` `rank` INT NOT NULL AFTER `leaderboard_id`, CHANGE `user_id` `user_id` BIGINT UNSIGNED NOT NULL AFTER `rank`, CHANGE `earnings` `earnings` DECIMAL(10,8) NOT NULL DEFAULT '0.00000000' AFTER `user_id`, CHANGE `reward` `reward` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL AFTER `earnings`, CHANGE `status` `status` ENUM('pending','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending' AFTER `reward`;");
        DB::statement("ALTER TABLE `leaderboard_entries` CHANGE `user_id` `user_id` BIGINT UNSIGNED NOT NULL;");
        DB::statement("ALTER TABLE `leaderboard_entries` DROP INDEX `leaderboard_id`;");

    }
};
