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
        Schema::create('user_payment_modes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->string('payment_method_code');
            $table->string('account')->nullable();
            $table->string('payment_inputs', 999)->nullable();
            $table->boolean('enabled')->default(1);
            $table->string('admin_note')->nullable();
            $table->string('verify_code', 15)->nullable();
            $table->string('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_payment_modes');
    }
};
