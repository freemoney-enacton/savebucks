<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_sales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id');
            $table->unsignedBigInteger('sales_id')->unique('sales_id');
            $table->unsignedBigInteger('network_id')->index('network_id');
            $table->string('order_id')->nullable();
            $table->unsignedBigInteger('store_id')->index('store_id');
            $table->unsignedBigInteger('click_id')->index('click_id');
            $table->string('click_code', 10)->nullable()->index();
            $table->decimal('order_amount', 10);
            $table->decimal('cashback', 10);
            $table->enum('cashback_type', ['cashback', 'reward'])->default('cashback');
            $table->char('currency', 3);
            $table->enum('status', ['pending', 'confirmed', 'declined'])->index('status');
            $table->dateTime('transaction_time')->index('transaction_time');
            $table->date('expected_date')->nullable();
            $table->boolean('mail_sent')->default(false);
            $table->boolean('lock_status')->default(false)->comment('Disable network updates for Status');
            $table->boolean('lock_amount')->default(false)->comment('Disable network updates for Amount');
            $table->json('note')->nullable();
            $table->string('admin_note', 500)->nullable()->comment('internal use only');
            $table->timestamps();

            $table->index(['transaction_time', 'cashback', 'status'], 'idx_user_sales_transaction_time');
            $table->index(['user_id', 'transaction_time'], 'user_sales_per_month');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_sales');
    }
};
