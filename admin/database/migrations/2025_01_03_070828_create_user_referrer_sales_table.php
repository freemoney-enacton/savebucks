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
        Schema::create('user_referrer_sales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('sales_id')->index('sales_id');
            $table->integer('user_id');
            $table->integer('shopper_id')->index('shopper_id');
            $table->decimal('order_amount', 10);
            $table->dateTime('transaction_time');
            $table->unsignedBigInteger('store_id');
            $table->decimal('referral_amount', 10);
            $table->char('currency', 3);
            $table->enum('status', ['pending', 'confirmed', 'declined'])->default('pending');
            $table->boolean('mail_sent')->default(false);
            $table->string('admin_note', 500)->nullable()->comment('internal use only');
            $table->timestamps();

            $table->index(['transaction_time', 'referral_amount', 'status'], 'idx_user_referrer_sales_transaction_time');
            $table->index(['user_id', 'transaction_time'], 'user_referral_per_month');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_referrer_sales');
    }
};
