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
        Schema::table('leader_board_configurations', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
            $table->enum('frequency', ['Daily', 'Weekly', 'Monthly', 'Manual'])->after('name');
            $table->longText('distribution_logic')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leader_board_configurations', function (Blueprint $table) {
            $table->id('id')->change();
            $table->dropColumn('frequency');
            $table->string('frequency')->after('name');
            $table->json('distribution_logic')->nullable()->change();
        });
    }
};
