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
            $table->decimal('rating', 5, 2)->default(0.00);
            $table->unsignedInteger('rating_count')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->dropColumn('rating');
            $table->dropColumn('rating_count');
        });
    }
};
