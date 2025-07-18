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
        Schema::table('offerwall_postback_logs', function (Blueprint $table) {
            $table->string('network')->nullable()->change();
            $table->string('transaction_id')->nullable()->change();
            $table->text('payload')->nullable()->change();
            $table->text('data')->nullable()->change();
            $table->string('message')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offerwall_postback_logs', function (Blueprint $table) {
            $table->string('network')->nullable(false)->change();
            $table->string('transaction_id')->nullable(false)->change();
            $table->text('payload')->nullable(false)->change();
            $table->text('data')->nullable(false)->change();
            $table->string('message')->nullable(false)->change();
        });
    }
};
