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
        Schema::create('campaign_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->string('name');
            $table->string('description');
            $table->enum('commission_type', ['fixed', 'percent']);
            $table->decimal('commission_amount', 10, 2);
            $table->char('tracking_code',10);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            
            // Indexes
            $table->index('campaign_id');
            $table->index('tracking_code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_goals');
    }
};
