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
       Schema::create('conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('postback_log_id')->constrained('postback_logs')->onDelete('cascade');
            $table->string('click_code');
            $table->foreignId('campaign_goal_id')->constrained('campaign_goals')->onDelete('cascade');
            $table->foreignId('affiliate_id')->constrained('affiliates')->onDelete('cascade');
            $table->string('transaction_id')->unique();
            $table->decimal('conversion_value', 12, 2);
            $table->decimal('commission', 12, 2);
            $table->string('sub1')->nullable();
            $table->string('sub2')->nullable();
            $table->string('sub3')->nullable();
            $table->enum('status', ['pending', 'approved', 'declined', 'paid'])->default('pending');
            $table->foreignId('payout_id')->nullable()->constrained('payouts')->onDelete('set null');
            $table->string('admin_notes',500)->nullable();
            $table->timestamp('converted_at');
            $table->timestamps();
            
            // Indexes
            $table->index('campaign_id');
            $table->index('postback_log_id');
            $table->index('click_code');
            $table->index('campaign_goal_id');
            $table->index('affiliate_id');
            $table->index('transaction_id');
            $table->index('status');
            $table->index('payout_id');
            $table->index('converted_at');
            $table->index(['sub1', 'sub2', 'sub3']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversions');
    }
};
