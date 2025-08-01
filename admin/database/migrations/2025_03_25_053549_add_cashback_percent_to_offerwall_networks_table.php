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
            $table->decimal('cashback_percent',10,2)->default(50.00)->index('cashback_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->dropColumn('cashback_percent');
        });
    }
};
