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
        Schema::create('fabricator_pages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100)->nullable()->index('pages_name_index');
            $table->string('title', 100)->index('pages_title_index');
            $table->string('slug');
            $table->string('layout')->default('default')->index('pages_layout_index');
            $table->string('content')->nullable();
            $table->longText('blocks');
            $table->boolean('exclude_seo')->default(false);
            $table->enum('status', ['draft', 'publish', 'trash'])->default('draft');
            $table->unsignedBigInteger('parent_id')->nullable()->index('pages_parent_id_foreign');
            $table->timestamps();

            $table->unique(['slug', 'parent_id'], 'pages_slug_parent_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fabricator_pages');
    }
};
