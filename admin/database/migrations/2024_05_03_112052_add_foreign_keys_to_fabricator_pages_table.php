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
        Schema::table('fabricator_pages', function (Blueprint $table) {
            // $table->foreign(['parent_id'], 'pages_parent_id_foreign')->references(['id'])->on('fabricator_pages')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fabricator_pages', function (Blueprint $table) {
            // $table->dropForeign('pages_parent_id_foreign');
        });
    }
};
