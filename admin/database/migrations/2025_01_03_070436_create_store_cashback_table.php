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
        Schema::create('store_cashback', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('store_id')->index('store_id');
            $table->string('network_refid')->nullable();
            $table->longText('title')->nullable()->comment('multi lang ||type=lang');
            $table->longText('description')->nullable()->comment('multi lang ||type=lang');
            $table->enum('rate_type', ['fixed', 'percent'])->default('percent');
            $table->decimal('commission', 10)->default(0);
            $table->decimal('cashback', 10)->default(0)->comment('Derived value. rate_amount_network*cashback_percent. Avoid calc everytime');
            $table->boolean('enabled')->default(true);
            $table->boolean('is_manual')->default(false);
            $table->timestamps();
            $table->boolean('lock_title')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('store_cashback');
    }
};
