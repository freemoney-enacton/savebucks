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
        Schema::create('user_daily_bonus_ladder', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id');
            $table->string('status');
            $table->decimal('amount', 10,2);
            $table->integer('step');

            $table->timestamp('expires_at')->nullable();
            $table->timestamp('claimed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_daily_bonus_ladder');
    }
};
