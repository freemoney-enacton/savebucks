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
    public function up()
    {
        Schema::create('store_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->json('name')->comment('multi lang ||type=lang');
            $table->string('slug')->unique('slug');
            $table->unsignedBigInteger('parent_id')->nullable()->index('parent_id');
            $table->json('description')->nullable()->comment('multi lang ||type=lang');
            $table->string('icon')->nullable()->comment('Cat Image ||type=image,path=/uploads/images/cat/');
            $table->string('header_image', 500)->nullable()->comment('Banner Image||type=image,path=/uploads/images/cat/');
            $table->boolean('is_featured')->default(false);
            $table->json('h1')->nullable()->comment('multi lang ||type=lang');
            $table->json('h2')->nullable()->comment('multi lang ||type=lang');
            $table->json('meta_title')->nullable()->comment('multi lang ||type=lang');
            $table->json('meta_desc')->nullable()->comment('multi lang ||type=lang');
            $table->boolean('exclude_sitemap')->default(false);
            $table->integer('visits')->default(0);
            $table->integer('store_count')->default(0)->comment('Auto Updated to reduce time to dynamically calculate each time');
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
        Schema::dropIfExists('store_categories');
    }
};
