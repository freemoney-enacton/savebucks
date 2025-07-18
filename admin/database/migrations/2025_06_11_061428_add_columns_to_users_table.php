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
        Schema::table('users', function (Blueprint $table) {

            $table->renameColumn('affiliate_click_id', 'affiliate_click_code');    
            $table->boolean('first_survey_completed')->default(false)->after('email_verified_at');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->renameColumn('affiliate_click_code', 'affiliate_click_id');            
            $table->dropColumn('first_survey_completed');
            
        });
    }
};
