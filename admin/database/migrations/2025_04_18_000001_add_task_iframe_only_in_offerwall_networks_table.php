<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTaskIframeOnlyInOfferwallNetworksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->boolean('task_iframe_only')->default(0);
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
            $table->dropColumn('task_iframe_only');
        });
    }
}
