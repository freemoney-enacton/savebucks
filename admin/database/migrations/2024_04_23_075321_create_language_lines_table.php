<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // Schema::create('language_lines', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->string('group')->index();
        //     $table->string('key')->index();
        //     $table->json('text')->default(new \Illuminate\Database\Query\Expression('(JSON_ARRAY())'));
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('language_lines');
    }
};
