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
        Schema::create('user_bonus_code_redemptions', function (Blueprint $table) {
            $table->id(); // This will create an auto-incrementing `id` column
            $table->unsignedBigInteger('user_id');
            $table->string('bonus_code', 255);
            $table->timestamps(); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_bonus_code_redemptions');

    }
};
