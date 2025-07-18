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
       Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('affiliates')->onDelete('cascade');
            $table->decimal('requested_amount', 12, 2);
            $table->enum('status', ['pending', 'processing', 'paid', 'rejected'])->default('pending');
            $table->string('payment_method', 50);
            $table->string('payment_account');
            $table->json('payment_details')->nullable();
            $table->string('admin_notes',500)->nullable();
            $table->string('transaction_id')->nullable();
            $table->json('api_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('affiliate_id');
            $table->index('status');
            $table->index('payment_method');
            $table->index('paid_at');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
