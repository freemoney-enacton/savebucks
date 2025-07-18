<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDecimalPrecisionInSalesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Modify user_sales table
        Schema::table('user_sales', function (Blueprint $table) {
            $table->decimal('order_amount', 10, 5)->change();
            $table->decimal('cashback', 10, 5)->change();
        });

        // Modify user_offerwall_sales table
        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->decimal('amount', 10, 5)->change();
            $table->decimal('payout', 10, 5)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert back to original DECIMAL(10,2)
        Schema::table('user_sales', function (Blueprint $table) {
            $table->decimal('order_amount', 10, 2)->change();
            $table->decimal('cashback', 10, 2)->change();
        });

        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
            $table->decimal('payout', 10, 2)->change();
        });
    }
}
