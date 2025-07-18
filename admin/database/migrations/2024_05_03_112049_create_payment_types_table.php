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
        Schema::create('payment_types', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('code')->index('code');
            $table->string('name');
            $table->string('image');
            $table->string('account_input_type', 500);
            $table->string('account_input_label', 500);
            $table->string('account_input_hint', 500);
            $table->json('payment_inputs');
            $table->decimal('minimum_amount', 10, 4);
            $table->decimal('transaction_fees_amount', 10, 4)->nullable();
            $table->enum('transaction_fees_type', ['fixed', 'percent'])->nullable();
            $table->decimal('transaction_bonus_amount', 10, 4)->nullable();
            $table->enum('transaction_bonus_type', ['fixed', 'percent'])->nullable();
            $table->boolean('cashback_allowed')->default(true);
            $table->boolean('bonus_allowed')->default(true);
            $table->string('payment_group');
            $table->boolean('enabled')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_types');
    }
};
