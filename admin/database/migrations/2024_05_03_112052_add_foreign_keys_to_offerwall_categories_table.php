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
        Schema::table('offerwall_categories', function (Blueprint $table) {
            $table->foreign(['id'], 'offerwall_categories_ibfk_1')->references(['category_id'])->on('offerwall_tasks')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_categories', function (Blueprint $table) {
            $table->dropForeign('offerwall_categories_ibfk_1');
        });
    }
};
