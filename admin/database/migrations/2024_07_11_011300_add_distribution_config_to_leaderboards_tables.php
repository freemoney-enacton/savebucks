<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leader_board_configurations', function (Blueprint $table) {
            $table->json('distribution_config')->nullable();
        });
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->json('distribution_config')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leader_board_configurations', function (Blueprint $table) {
            $table->dropColumn('distribution_config');
        });
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->dropColumn('distribution_config');
        });
    }
};
