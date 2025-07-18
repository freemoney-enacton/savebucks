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
        Schema::create('tiers', function (Blueprint $table) {
            $table->id();
            $table->integer('tier');
            $table->json('label');
            $table->string('icon');
            $table->decimal('affiliate_commission', 10, 2);
            $table->decimal('required_affiliate_earnings', 10, 2);
            $table->decimal('required_affiliate_earnings_last_30_days', 10, 2)->nullable();
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiers');
    }
};
