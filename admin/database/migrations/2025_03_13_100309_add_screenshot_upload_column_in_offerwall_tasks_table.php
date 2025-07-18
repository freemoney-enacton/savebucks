<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddScreenshotUploadColumnInOfferwallTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->boolean('screenshot_upload')->default(0);
            $table->string('screenshot_instructions')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->dropColumn('screenshot_upload');
            $table->dropColumn('screenshot_instructions');
        });
    }
}
