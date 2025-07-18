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
        Schema::create('user_payments', function (Blueprint $table) {
            $table->integer('id', true);
            $table->bigInteger('payment_id');
            $table->integer('user_id')->index('user_payments_ibfk_1');
            $table->string('payment_method_code')->index('user_payments_ibfk_2');
            $table->string('account');
            $table->longText('payment_input');
            $table->bigInteger('amount');
            $table->bigInteger('cashback_amount')->nullable();
            $table->bigInteger('bonus_amount')->nullable();
            $table->enum('status', ['created', 'processing', 'completed', 'declined']);
            $table->longText('api_response')->nullable();
            $table->string('api_reference_id')->nullable();
            $table->string('api_status')->nullable();
            $table->string('note')->nullable();
            $table->string('admin_note')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_payments');
    }
};
