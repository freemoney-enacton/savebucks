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
        Schema::create('offerwall_task_goals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('network', 50);
            $table->string('task_offer_id')->index();
            $table->string('network_task_id');
            $table->string('network_goal_id');
            $table->string('import_id')->nullable();
            $table->string('network_goal_name');
            $table->longText('name')->comment('multi lang ||type=lang');
            $table->longText('description')->nullable()->comment('multi lang ||type=lang');
            $table->string('image')->nullable()->comment('Offerwall Task Goal Image ||type=image,path=/uploads/images/ow_taskgoalimages/');
            $table->decimal('cashback', 10)->default(0);
            $table->decimal('revenue', 10)->default(0);
            $table->enum('status', ['publish', 'draft', 'trash'])->nullable()->default('publish');
            $table->boolean('is_translated')->default(false);
            $table->timestamps();

            $table->unique(['network', 'task_offer_id', 'network_goal_id'], 'unique_goal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerwall_task_goals');
    }
};
