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
        Schema::create('user_spins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');

            $table->string('code');

            $table->string('source');

            $table->string('spin_code');
            $table->json('spin_config');
            $table->decimal('max_reward_amount', 10,2);
            $table->string('reward_code')->nullable();

            $table->enum('status', ['available','claimed','denied','expired'])->default('available');

            $table->timestamp('awarded_at');
            $table->timestamp('expires_at')->nullable();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_spins');
    }
};
