<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('logo_url')->nullable();
            $table->string('campaign_type');
            $table->enum('status', ['active', 'paused', 'ended'])->default('active');
            $table->text('terms_and_conditions')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('status');
            $table->index('campaign_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
