<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->longText('name')->comment('multi lang ||type=lang');
            $table->string('slug');
            $table->string('logo', 200)->nullable()->comment('Store logo||type=image,path=/uploads/images/store/');
            $table->string('banner_image', 500)->nullable()->comment('Store logo||type=image,path=/uploads/images/store/');
            $table->string('homepage', 500);
            $table->string('domain_name')->nullable();
            $table->string('deeplink', 2500)->nullable();
            $table->string('extension_afflink', 2500)->nullable();
            $table->longText('about')->nullable()->comment('multi lang ||type=lang_editor');
            $table->longText('terms_todo')->nullable()->comment('multi lang ||type=lang_editor');
            $table->longText('terms_not_todo')->nullable()->comment('multi lang ||type=lang_editor');
            $table->longText('tips')->nullable()->comment('multi lang ||type=lang_editor');
            $table->longText('cats')->nullable()->comment('Categories Store Belongs to||type=json_select,table=store_categories,id=id,name=name,multi=1');
            $table->boolean('cashback_enabled')->default(true);
            $table->decimal('cashback_percent', 5)->default(0);
            $table->decimal('cashback_amount', 10)->nullable();
            $table->string('cashback_type', 50)->default('cashback');
            $table->string('cashback_was')->nullable();
            $table->longText('tracking_speed')->nullable()->comment('multi lang ||type=lang');
            $table->enum('amount_type', ['percent', 'fixed'])->default('percent');
            $table->enum('rate_type', ['flat', 'upto'])->default('upto');
            $table->string('confirm_duration', 100)->nullable();
            $table->boolean('is_claimable')->default(true);
            $table->boolean('is_shareable')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->json('country_tenancy')->nullable();
            $table->boolean('is_promoted')->default(false);
            $table->longText('h1')->nullable()->comment('multi lang ||type=lang');
            $table->longText('h2')->nullable()->comment('multi lang ||type=lang');
            $table->longText('meta_title')->nullable()->comment('multi lang ||type=lang_textarea');
            $table->longText('meta_desc')->nullable()->comment('multi lang ||type=lang_textarea');
            $table->longText('meta_kw')->nullable()->comment('multi lang ||type=lang_textarea');
            $table->boolean('exclude_sitemap')->default(false);
            $table->integer('visits')->default(0);
            $table->integer('offers_count')->default(0);
            $table->string('ref_id', 50)->nullable();
            $table->decimal('rating', 10, 1)->default(0);
            $table->integer('rating_count')->default(0);
            $table->integer('clicks')->default(0);
            $table->string('creation_mode', 50)->default('admin');
            $table->integer('network_id')->nullable()->default(0);
            $table->string('network_campaign_id', 191)->default('0');
            $table->boolean('ghost')->default(false);
            $table->longText('filter')->nullable();
            $table->enum('status', ['publish', 'draft', 'trash'])->default('draft')->index('status');
            $table->timestamps();
            $table->json('apply_coupon')->nullable();
            $table->string('checkout_url')->nullable();
            $table->boolean('exclude_extension')->default(false);
            $table->string('discount', 250)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stores');
    }
};
