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
        Schema::create('streak_configurations', function (Blueprint $table) {
            $table->id();

            $table->integer('day');
            
            $table->string('reward_type');
            $table->decimal('amount', 10,2)->nullable();
            $table->string('spin_code')->nullable();

            $table->boolean('enabled')->default(true);


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('streak_configurations');
    }
};
