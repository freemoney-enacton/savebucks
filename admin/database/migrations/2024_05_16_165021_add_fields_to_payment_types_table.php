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
        Schema::table('payment_types', function (Blueprint $table) {
            $table->string('description')->nullable();
            $table->string('minimum_amount_first')->nullable();
            $table->boolean('transaction_fees_allowed')->nullable();
            $table->boolean('transaction_bonus_allowed')->nullable();
            $table->boolean('country_customizable')->default(1)->nullable();
            $table->json('country_configuration')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_types', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->dropColumn('minimum_amount_first');
            $table->dropColumn('transaction_fees_allowed');
            $table->dropColumn('transaction_bonus_allowed');
            $table->dropColumn('country_customizable');
            $table->dropColumn('country_configuration');
        });
    }
};
