<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';

    public function up(): void
    {
        Schema::table('conversions', function (Blueprint $table) {
            $table->decimal('user_earned', 12, 2)->default(0)->after('commission');
        });
    }

    public function down(): void
    {
        Schema::table('conversions', function (Blueprint $table) {
            $table->dropColumn('user_earned');
        });
    }
};
