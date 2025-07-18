<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paypal_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('payment_id');
            $table->string('request_type', 50)->comment('Type of PayPal API call (payout, status_check)');
            $table->json('request_payload')->nullable()->comment('Request sent to PayPal');
            $table->json('response_payload')->nullable()->comment('Response received from PayPal');
            $table->string('status_code', 10)->nullable()->comment('HTTP status code');
            $table->boolean('success')->default(false)->comment('Whether the API call was successful');
            $table->string('error_message')->nullable()->comment('Error message if API call failed');
            $table->string('paypal_batch_id')->nullable()->comment('PayPal batch ID for reference');
            $table->ipAddress('ip_address')->nullable()->comment('IP address of the request initiator');
            $table->timestamps();

            // Indexes
            $table->index('request_type');
            $table->index('paypal_batch_id');
            $table->index(['payment_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paypal_logs');
    }
};
