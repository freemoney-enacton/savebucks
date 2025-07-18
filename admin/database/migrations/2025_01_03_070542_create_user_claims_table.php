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
        Schema::create('user_claims', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->index('user_id');
            $table->unsignedBigInteger('click_id')->unique('click_id');
            $table->string('click_code', 10)->nullable()->index();
            $table->unsignedBigInteger('store_id');
            $table->integer('network_id')->nullable();
            $table->string('network_campaign_id')->nullable();
            $table->dateTime('click_time');
            $table->string('order_id');
            $table->string('receipt', 500)->nullable();
            $table->char('currency', 3)->index('currency');
            $table->decimal('order_amount', 10);
            $table->date('transaction_date');
            $table->enum('platform', ['website', 'mobile', 'ios', 'android'])->default('website');
            $table->string('user_message', 500)->nullable();
            $table->string('admin_note', 500)->nullable()->comment('internal use only');
            $table->enum('status', ['open', 'hold', 'answered', 'closed'])->default('open');
            $table->enum('closed_by', ['admin', 'user'])->default('admin');
            $table->timestamps();

            $table->unique(['store_id', 'order_id'], 'store_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_claims');
    }
};
