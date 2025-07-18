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
            $table->enum('render_type', ['popup', 'new_tab', 'same_tab'])->nullable()->default('popup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->dropColumn('render_type');
        });
    }
};
