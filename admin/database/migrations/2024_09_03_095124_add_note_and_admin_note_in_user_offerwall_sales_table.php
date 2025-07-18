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
        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->string('note',500)->nullable();
            $table->string('admin_note',500)->nullable();
        });
        Schema::table('user_bonus', function (Blueprint $table) {
            $table->string('note',500)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->dropColumn('note',500);
            $table->dropColumn('admin_note',500);
        });
        Schema::table('user_bonus', function (Blueprint $table) {
            $table->dropColumn('note',500);
        });
    }
};
