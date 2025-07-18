<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{   
    protected $connection = "affiliate";
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payouts', function (Blueprint $table) {
            $table->string('api_reference_id')->nullable()->after('transaction_id');
            $table->string('api_status')->nullable()->after('api_reference_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payouts', function (Blueprint $table) {
           $table->dropColumn(['api_reference_id', 'api_status']);
        });
    }
};
