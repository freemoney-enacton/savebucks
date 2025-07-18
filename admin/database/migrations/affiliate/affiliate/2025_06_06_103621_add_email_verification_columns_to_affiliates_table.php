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
        Schema::table('affiliates', function (Blueprint $table) {

            $table->boolean('is_email_verified')->default(false)->after('email');
            $table->timestamp('email_verified_at')->nullable()->after('is_email_verified');
            $table->string('token')->nullable()->after('email_verified_at');
            $table->timestamp('token_expiry')->nullable()->after('token');

            //indexes
            $table->index('is_email_verified');
            $table->index('token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('affiliates', function (Blueprint $table) {
            $table->dropIndex(['is_email_verified']);
            $table->dropIndex(['token']);
            $table->dropColumn([
                'is_email_verified',
                'email_verified_at', 
                'token',
                'token_expiry'
            ]);
        });
    }
};
