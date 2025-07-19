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
        Schema::connection('affiliate')->table('affiliate_postbacks', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false);
            $table->softDeletes(); // This adds deleted_at timestamp
            $table->text('method_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('affiliate')->table('affiliate_postbacks', function (Blueprint $table) {
            $table->dropColumn(['is_deleted', 'method_type']);
            $table->dropSoftDeletes(); // This drops deleted_at
        });
    }
};
