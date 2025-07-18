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
        Schema::create('offerwall_networks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->char('code', 50);
            $table->string('logo')->nullable()->comment('Offerwall Network Image ||type=image,path=/uploads/images/ow_networks/');
            $table->enum('type', ['tasks', 'surveys']);
            $table->longText('config_params')->nullable();
            $table->string('postback_validation_key')->nullable()->comment('Used to validate postback on our end');
            $table->string('postback_key')->nullable();
            $table->string('api_key')->nullable();
            $table->string('app_id')->nullable();
            $table->string('pub_id')->nullable();
            $table->string('survey_url')->nullable();
            $table->string('countries')->nullable();
            $table->string('categories')->nullable();
            $table->boolean('enabled')->nullable()->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerwall_networks');
    }
};
