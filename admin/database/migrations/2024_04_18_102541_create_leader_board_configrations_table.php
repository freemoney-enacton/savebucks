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
        Schema::create('leader_board_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();

            # COMMENT THIS LINE AS frequency COLUMN CHANGED DATATYPE IN BELOW MIGRATION
            # database\migrations\2024_05_03_112049_create_leader_board_configurations_table.php
            // $table->string('frequency');
            $table->boolean('is_enabled')->default(1);
            $table->decimal('prize')->nullable();
            $table->integer('users')->default(0);
            $table->json('distribution_logic')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leader_board_configurations');
    }
};
