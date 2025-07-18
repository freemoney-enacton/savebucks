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
        Schema::create('user_offerwall_sales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('network', 50);
            $table->char('transaction_id', 100);
            $table->integer('user_id')->index();
            $table->string('task_offer_id')->index();
            $table->string('network_goal_id')->nullable();
            $table->string('offer_id');
            $table->string('task_name');
            $table->char('task_type', 10);
            $table->decimal('amount', 10);
            $table->decimal('payout', 10);
            $table->enum('status', ['pending', 'confirmed', 'declined'])->default('pending')->index();
            $table->longText('extra_info')->nullable();
            $table->boolean('mail_sent')->default(false);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['network', 'transaction_id'], 'unique_transaction');
            $table->unique(['network', 'task_offer_id', 'user_id', 'network_goal_id'], 'unique_transaction_per_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_offerwall_sales');
    }
};
