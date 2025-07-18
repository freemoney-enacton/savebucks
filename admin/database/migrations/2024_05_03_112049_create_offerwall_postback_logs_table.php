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
        Schema::create('offerwall_postback_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('network', 50);
            $table->char('transaction_id', 50)->nullable();
            $table->text('payload');
            $table->text('data');
            $table->enum('status', ['pending', 'processed', 'error', 'chargeback'])->default('pending');
            $table->string('message');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerwall_postback_logs');
    }
};
