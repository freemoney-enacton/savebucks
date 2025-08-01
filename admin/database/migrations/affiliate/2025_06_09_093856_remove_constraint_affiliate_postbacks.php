<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{   

    protected $connection = 'affiliate';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //drop constraint unique for affiliate_postback_unique
        Schema::connection('affiliate')->table('affiliate_postbacks', function (Blueprint $table) {
            $table->dropUnique('affiliate_postback_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
    }
};
