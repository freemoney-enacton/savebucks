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
        Schema::create('blocks', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name');
            $table->string('purpose');
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('content')->nullable();
            $table->longText('blocks');
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
        Schema::dropIfExists('blocks');
    }
};
