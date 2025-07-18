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
        Schema::create('clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('affiliate_link_id')->constrained('affiliate_links')->onDelete('cascade');
            $table->foreignId('affiliate_id')->constrained('affiliates')->onDelete('cascade');
            $table->string('click_code')->unique();
            $table->string('ip_address');
            $table->string('user_agent',1000);
            $table->string('referrer')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('device_type')->nullable();
            $table->string('sub1')->nullable();
            $table->string('sub2')->nullable();
            $table->string('sub3')->nullable();
            $table->boolean('is_converted')->default(false);
            $table->timestamp('clicked_at');
            
            // Indexes
            $table->index('campaign_id');
            $table->index('affiliate_link_id');
            $table->index('affiliate_id');
            $table->index('click_code');
            $table->index('is_converted');
            $table->index('clicked_at');
            $table->index(['sub1', 'sub2', 'sub3']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clicks');
    }
};
