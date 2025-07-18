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
        Schema::table('user_referrer_sales', function (Blueprint $table) {
            $table->foreign(['sales_id'], 'user_referrer_sales_ibfk_1')->references(['id'])->on('sales');
            $table->foreign(['user_id'], 'user_referrer_sales_ibfk_2')->references(['id'])->on('users');
            $table->foreign(['shopper_id'], 'user_referrer_sales_ibfk_3')->references(['id'])->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_referrer_sales', function (Blueprint $table) {
            $table->dropForeign('user_referrer_sales_ibfk_1');
            $table->dropForeign('user_referrer_sales_ibfk_2');
            $table->dropForeign('user_referrer_sales_ibfk_3');
        });
    }
};
