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
        Schema::table('paypal_logs', function (Blueprint $table) {
            $table->string('log_type', 20)->nullable()->default('user')->after('payment_id');
            $table->index('log_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paypal_logs', function (Blueprint $table) {
            $table->dropIndex(['log_type']);
            $table->dropColumn('log_type');
        });
    }
};
