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
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->string('default_conversion_status')->nullable();
            $table->json('conversion_statuses')->nullable();
            $table->text('whitelist_ips')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->dropColumn('default_conversion_status');
            $table->dropColumn('conversion_statuses');
            $table->dropColumn('whitelist_ips');
        });
    }
};
