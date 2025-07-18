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
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('remember_token', 191)->nullable();
            $table->string('referral_code')->nullable();
            $table->string('referrer_code')->nullable();
            $table->string('provider_type')->nullable();
            $table->string('provider_id')->nullable();
            $table->boolean('is_verified')->nullable()->default(false);
            $table->boolean('is_private')->default(false);
            $table->string('country_code')->nullable();
            $table->json('metadata')->nullable();
            $table->string('signup_ip')->nullable();
            $table->string('device_id')->nullable();
            $table->string('timezone')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
