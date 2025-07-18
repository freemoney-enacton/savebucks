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
        Schema::table('spin_configuration', function (Blueprint $table) {
            $table->decimal('max_amount', 10, 2)->nullable();
            $table->decimal('min_amount', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spin_configuration', function (Blueprint $table) {
            $table->dropColumn(['max_amount', 'min_amount']);
        });
    }
};
