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
            $table->string('slug',500)->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
