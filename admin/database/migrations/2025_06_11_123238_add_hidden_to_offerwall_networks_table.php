<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHiddenToOfferwallNetworksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->boolean('hidden')->default(0)->after('task_iframe_only');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->dropColumn('hidden');
        });
    }
}
