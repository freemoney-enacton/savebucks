<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTangoLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tango_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
			$table->string('user_payment_id',10);
            $table->enum('type', ['payment', 'status']);
            $table->json('data');
            $table->boolean('success');
            $table->string('status_code');
            $table->string('status');
            $table->json('response');
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
        Schema::dropIfExists('tango_logs');
    }
}
