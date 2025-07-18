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
        Schema::create('spin_configuration', function (Blueprint $table) {
            $table->id();
            $table->string('spin_code');

            $table->string('title')->nullable();
            $table->string('icon')->nullable();
            
            $table->string('code');
            
            $table->decimal('amount', 10,2);
            $table->decimal('probability', 10,2);
            
            $table->boolean('enabled')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spin_configuration');
    }
};
