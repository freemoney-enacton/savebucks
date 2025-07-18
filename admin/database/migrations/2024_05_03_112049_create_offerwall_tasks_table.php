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
        Schema::create('offerwall_tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('network', 50)->index();
            $table->string('offer_id')->index();
            $table->string('campaign_id')->index();
            $table->unsignedBigInteger('category_id')->index('offerwall_tasks_category_id_foreign');
            $table->string('import_id')->nullable();
            $table->longText('name')->comment('multi lang ||type=lang');
            $table->longText('description')->nullable()->comment('multi lang ||type=lang');
            $table->longText('instructions')->nullable()->comment('multi lang ||type=lang');
            $table->string('image')->nullable();
            $table->string('network_image')->nullable()->comment('Offerwall Task Image ||type=image,path=/uploads/images/ow_taskimages/');
            $table->string('url', 2500);
            $table->decimal('payout', 10)->default(0);
            $table->longText('countries')->nullable();
            $table->longText('devices')->nullable();
            $table->longText('platforms')->nullable();
            $table->decimal('conversion_rate', 10, 5)->nullable();
            $table->decimal('score', 10, 5)->nullable();
            $table->decimal('daily_cap', 10, 5)->nullable();
            $table->dateTime('created_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('offer_type')->nullable();
            $table->longText('network_categories')->nullable();
            $table->longText('network_goals')->nullable();
            $table->unsignedInteger('redemptions')->default(0);
            $table->unsignedInteger('clicks')->default(0);
            $table->enum('status', ['publish', 'draft', 'trash'])->nullable()->default('publish');
            $table->boolean('is_translated')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('goals_count')->default(1);
            $table->timestamps();

            $table->unique(['network', 'campaign_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerwall_tasks');
    }
};
