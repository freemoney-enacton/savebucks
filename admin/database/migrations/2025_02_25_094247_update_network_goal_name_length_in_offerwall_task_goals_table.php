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
        Schema::table('offerwall_task_goals', function (Blueprint $table) {
            $table->string('network_goal_name',2500)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_task_goals', function (Blueprint $table) {
            $table->string('network_goal_name',255)->change();
        });
    }
};
