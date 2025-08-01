<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('offerwall_networks', function (Blueprint $table) {
        $table->unsignedTinyInteger('open_task_external_browser')->default(0);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('offerwall_networks', function (Blueprint $table) {
        $table->dropColumn('open_task_external_browser');
    });
}
};
