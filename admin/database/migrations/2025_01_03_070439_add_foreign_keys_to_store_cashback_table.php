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
        Schema::table('store_cashback', function (Blueprint $table) {
            $table->foreign(['store_id'], 'store_cashback_ibfk_1')->references(['id'])->on('stores');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('store_cashback', function (Blueprint $table) {
            $table->dropForeign('store_cashback_ibfk_1');
        });
    }
};
