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
        Schema::create('user_referral_earnings', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id');
            $table->bigInteger('referee_id');
            $table->decimal('amount', 10);
            $table->timestamp('transaction_time')->useCurrentOnUpdate()->nullable();
            $table->string('task_offer_id');
            $table->decimal('referral_amount', 10);
            $table->enum('status', ['pending', 'confirmed', 'declined']);
            $table->string('note', 500)->nullable();
            $table->string('admin_note', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->decimal('payout', 10);
            $table->string('transaction_id');
            $table->string('network');
            $table->string('offer_id');
            $table->bigInteger('sale_id');
            $table->string('task_type');

            $table->unique(['user_id', 'sale_id']);
            $table->unique(['user_id', 'transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_referral_earnings');
    }
};
