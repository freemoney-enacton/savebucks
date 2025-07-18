<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{   
    protected $connection = "affiliate";
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_install_events', function (Blueprint $table) {
            $table->id();
            $table->string('click_code')->unique();
            $table->string('device_type');
            $table->string('install_timestamp');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_install_events');
    }
};
