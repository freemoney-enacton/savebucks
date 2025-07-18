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
        Schema::table('user_sales', function (Blueprint $table) {
            // $table->foreign(['user_id'], 'user_sales_ibfk_1')->references(['id'])->on('users');
            // $table->foreign(['store_id'], 'user_sales_ibfk_2')->references(['id'])->on('stores');
            // $table->foreign(['click_id'], 'user_sales_ibfk_4')->references(['id'])->on('clicks');
            $table->foreign(['sales_id'], 'user_sales_ibfk_5')->references(['id'])->on('sales');
            $table->foreign(['network_id'], 'user_sales_ibfk_6')->references(['id'])->on('networks');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_sales', function (Blueprint $table) {
            $table->dropForeign('user_sales_ibfk_1');
            $table->dropForeign('user_sales_ibfk_2');
            $table->dropForeign('user_sales_ibfk_4');
            $table->dropForeign('user_sales_ibfk_5');
            $table->dropForeign('user_sales_ibfk_6');
        });
    }
};
