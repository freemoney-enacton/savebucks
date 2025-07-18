<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer("total_tokens")->nullable();
            $table->integer("current_level")->nullable();
            $table->integer("current_level_tokens")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn("total_tokens");
            $table->dropColumn("current_level");
            $table->dropColumn("current_level_tokens");
        });
    }
};
