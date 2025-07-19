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
        Schema::connection('affiliate')->table('affiliate_links', function (Blueprint $table) {
            $table->text("name")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('affiliate')->table('affiliate_links', function (Blueprint $table) {
            $table->dropColumn("name");
        });
    }
};
