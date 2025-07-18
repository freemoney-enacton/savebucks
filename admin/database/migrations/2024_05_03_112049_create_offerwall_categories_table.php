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
        Schema::create('offerwall_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('icon')->nullable()->comment('Offerwall Category Icon ||type=image,path=/uploads/images/ow_cats/');
            $table->string('banner_img')->nullable()->comment('Offerwall Category Banner ||type=image,path=/uploads/images/ow_cats_banner/');
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(100);
            $table->string('fg_color')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('mapping_for')->default('tasks');
            $table->string('match_keywords', 1000);
            $table->unsignedInteger('match_order')->default(100);
            $table->unsignedInteger('item_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerwall_categories');
    }
};
