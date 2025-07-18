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
        Schema::table('user_claims', function (Blueprint $table) {
            // $table->foreign(['user_id'], 'user_claims_ibfk_1')->references(['id'])->on('users');
            $table->foreign(['store_id'], 'user_claims_ibfk_3')->references(['id'])->on('stores');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_claims', function (Blueprint $table) {
            $table->dropForeign('user_claims_ibfk_1');
            $table->dropForeign('user_claims_ibfk_2');
            $table->dropForeign('user_claims_ibfk_3');
        });
    }
};
