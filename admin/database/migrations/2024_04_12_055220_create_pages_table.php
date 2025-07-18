<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create(config('filament-fabricator.table_name', 'pages'), function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->index();
            $table->string('title', 100)->index();
            $table->string('slug')->unique();
            $table->string('layout')->default('default')->index();
            $table->string('content')->nullable();
            $table->json('blocks');
            $table->boolean('exclude_seo')->default(0);
            $table->enum('status', ['draft', 'publish', 'trash'])->default('draft');
            $table->foreignId('parent_id')->nullable()->constrained('pages')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists(config('filament-fabricator.table_name', 'pages'));
    }
};
