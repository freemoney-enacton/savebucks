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
            $table->string('survey_id',2500)->nullable();
            $table->string('survey_name',2500)->nullable();

            $table->string('click_ip')->nullable();
            $table->string('score')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->dropColumn('survey_id');
            $table->dropColumn('survey_name');
            $table->dropColumn('click_ip');
            $table->dropColumn('score');
        });
    }
};
