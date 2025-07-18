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
        Schema::create('banners', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('title');
            $table->string('description');
            $table->string('link');
            $table->string('desktop_img');
            $table->string('mobile_img');
            $table->boolean('have_content')->nullable()->default(false);
            $table->string('btn_link');
            $table->string('btn_text');
            $table->enum('status', ['publish', 'trash', 'draft', '']);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
