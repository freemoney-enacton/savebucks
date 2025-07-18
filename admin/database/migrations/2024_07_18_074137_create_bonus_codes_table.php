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
        Schema::create('bonus_codes', function (Blueprint $table) {
            $table->id();
            
            $table->string('code');
            $table->string('title');

            $table->string('image')->nullable();
            $table->text('description')->nullable();
            
            $table->integer('tier')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            $table->integer('usage_count')->nullable();
            
            $table->string('reward_type');
            $table->string('spin_code')->nullable();
            $table->decimal('amount', 10,2);

            $table->boolean('enabled')->default(true);
                        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bonus_codes');
    }
};
