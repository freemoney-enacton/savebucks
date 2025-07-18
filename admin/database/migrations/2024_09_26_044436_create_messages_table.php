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
        Schema::create('messages', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('room_code', 500)->index('room_code');
            $table->integer('user_id')->index('user_id');
            $table->string('content', 2500);
            $table->string('country', 10)->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->string('user_name', 500)->nullable();
            $table->string('user_avatar', 2500)->nullable();
            $table->integer('user_tier')->nullable();
            $table->string('user_referral_code', 500)->nullable();
            $table->json('mentions')->nullable();
            $table->boolean('user_private')->nullable();
            $table->boolean('is_hidden')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
