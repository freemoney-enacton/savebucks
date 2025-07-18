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
         Schema::create('affiliate_postbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('affiliates')->onDelete('cascade');
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('campaign_goal_id')->nullable()->constrained('campaign_goals')->onDelete('cascade');
            $table->string('postback_url',1500);
            $table->timestamps();
            
            // Indexes
            $table->index('affiliate_id');
            $table->index('campaign_id');
            $table->index('campaign_goal_id');
            $table->unique(['affiliate_id', 'campaign_id', 'campaign_goal_id'], 'affiliate_postback_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_postbacks');
    }
};
