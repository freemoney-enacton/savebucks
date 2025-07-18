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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->integer('id', true);
            $table->enum('activity_type', ['tasks_earnings', 'bonus_earnings', 'referral_earnings', 'referrals', 'payouts']);
            $table->integer('user_id');
            $table->string('icon');
            $table->string('title');
            $table->string('status')->nullable();
            $table->bigInteger('amount')->nullable();
            $table->string('url')->nullable();
            $table->longText('data')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
