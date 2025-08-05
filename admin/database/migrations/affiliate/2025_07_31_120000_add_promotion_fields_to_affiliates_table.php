<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';

    public function up(): void
    {
        Schema::table('affiliates', function (Blueprint $table) {
            $table->enum('promotion_method', ['social_media', 'website', 'youtube', 'other'])->after('tax_id')->nullable();
            $table->string('website_link')->after('promotion_method')->nullable();
            $table->enum('estimated_monthly_leads', ['0-100','100-500','500-1000','1000+'])->after('website_link')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('affiliates', function (Blueprint $table) {
            $table->dropColumn(['promotion_method','website_link','estimated_monthly_leads']);
        });
    }
};
