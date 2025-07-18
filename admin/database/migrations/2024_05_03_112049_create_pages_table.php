<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // $table->dropColumn('parent_id');
            // $table->bigInteger('parent_id')->nullable()->change();
            $table->longText('blocks')->change();
            // $table->enum('status', ['publish', 'trash', 'draft', '']);
            DB::statement("ALTER TABLE pages CHANGE COLUMN status status ENUM('publish', 'trash', 'draft', '') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('pages');
    }
};
