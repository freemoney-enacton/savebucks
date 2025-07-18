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
        Schema::create('user_tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('network', 50);
            $table->char('task_offer_id', 50)->nullable()->index();
            $table->char('offer_id', 50)->index();
            $table->char('transaction_id', 50);
            $table->bigInteger('user_id')->index();
            $table->string('task_name');
            $table->char('task_type', 10);
            $table->decimal('amount', 10);
            $table->decimal('payout', 10);
            $table->enum('status', ['pending', 'confirmed', 'declined'])->default('pending')->index();
            $table->boolean('mail_sent')->default(false);
            $table->text('extra_info')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent();
            $table->string('network_goal_id')->nullable();

            $table->index(['network', 'transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_tasks');
    }
};
