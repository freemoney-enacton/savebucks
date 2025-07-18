<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTaskUploadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_task_uploads', function (Blueprint $table) {
            $table->id();
            $table->string('network');
            $table->string('offer_id');
            $table->string('platform');
            $table->string('task_offer_id');
            $table->foreignId('user_id');
            $table->string('upload_path',1000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_task_uploads');
    }
}
