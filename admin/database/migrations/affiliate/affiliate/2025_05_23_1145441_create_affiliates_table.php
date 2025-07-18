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
          Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->enum('approval_status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->string('paypal_address')->nullable();
            $table->json('bank_details')->nullable();
            $table->json('address')->nullable();
            $table->string('tax_id')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('email');
            $table->index('approval_status');
             });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliates');
    }
};
