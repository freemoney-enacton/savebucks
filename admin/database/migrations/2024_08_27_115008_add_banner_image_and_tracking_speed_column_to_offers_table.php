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
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->string('banner_image', 2500)->nullable();
            $table->string('tracking_speed')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->dropColumn(['banner_image', 'tracking_speed']);
        });
    }
};
