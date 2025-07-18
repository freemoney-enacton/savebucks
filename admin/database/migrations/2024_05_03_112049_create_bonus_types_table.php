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
        Schema::create('bonus_types', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->string('code', 25);
            $table->longText('name')->comment('multi lang ||type=lang');
            $table->decimal('amount', 10);
            $table->integer('qualifying_amount')->comment('Transaction Qualifying amount');
            $table->integer('validity_days')->default(90);
            $table->boolean('enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bonus_types');
    }
};
