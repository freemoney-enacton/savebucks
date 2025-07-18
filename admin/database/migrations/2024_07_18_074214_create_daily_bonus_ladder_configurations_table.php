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
        Schema::create('daily_bonus_ladder_configurations', function (Blueprint $table) {
            $table->id();

            $table->decimal('amount', 10,2);
            $table->decimal('probability', 10,2);
            $table->integer('step');

            $table->string('icon')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('active_color')->nullable();
            $table->string('title')->nullable();
            
            $table->boolean('enabled')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_bonus_ladder_configurations');
    }
};
