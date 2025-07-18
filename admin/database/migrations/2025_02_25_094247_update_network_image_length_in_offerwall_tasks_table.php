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
            $table->string('image',2500)->change();
            $table->string('network_image',2500)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->string('image',255)->change();
            $table->string('network_image',255)->change();
        });
    }
};
