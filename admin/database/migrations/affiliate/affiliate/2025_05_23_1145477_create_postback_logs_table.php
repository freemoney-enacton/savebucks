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
        Schema::create('postback_logs', function (Blueprint $table) {
            $table->id();
            $table->json('raw_postback_data');
            $table->string('transaction_id');
            $table->enum('status', ['success', 'failure','pending']);
            $table->json('status_messages')->nullable();
            $table->timestamp('received_at');
            $table->timestamp('processed_at')->nullable();
            
            // Indexes
            $table->index('transaction_id');
            $table->index('status');
            $table->index('received_at');
            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postback_logs');
    }
};
