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
        $this->down();
        
         Schema::create('affiliate_campaign_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('affiliates')->onDelete('cascade');
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('campaign_goal_id')->constrained('campaign_goals')->onDelete('cascade');
            $table->decimal('custom_commission_rate', 5, 2)->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('affiliate_id');
            $table->index('campaign_id');
            $table->index('campaign_goal_id');
            $table->unique(['affiliate_id', 'campaign_goal_id'], 'affiliate_goal_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_campaign_goals');
    }
};
