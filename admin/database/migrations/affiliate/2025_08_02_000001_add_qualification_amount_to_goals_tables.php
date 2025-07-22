<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';

    public function up(): void
    {
        Schema::table('campaign_goals', function (Blueprint $table) {
            $table->decimal('qualification_amount', 10, 2)->default(0);
        });

        Schema::table('affiliate_campaign_goals', function (Blueprint $table) {
            $table->decimal('qualification_amount', 10, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('campaign_goals', function (Blueprint $table) {
            $table->dropColumn('qualification_amount');
        });

        Schema::table('affiliate_campaign_goals', function (Blueprint $table) {
            $table->dropColumn('qualification_amount');
        });
    }
};
