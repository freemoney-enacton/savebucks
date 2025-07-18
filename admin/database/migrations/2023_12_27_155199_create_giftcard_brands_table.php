<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGiftCardBrandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('giftcard_brands', function (Blueprint $table) {
            $table->id();
            $table->char('vendor', 25)->index();
            $table->char('sku', 50)->index();
            $table->string('name', 500)->nullable();
            $table->text('description')->nullable();
            $table->text('terms')->nullable();
            $table->string('image', 500)->nullable();
            $table->json('countries')->nullable();
            $table->json('items')->nullable();
            $table->json('denomination')->nullable();
            $table->string('card_status', 50)->comment('GiftCard Status')->index('card_status');           
            $table->enum('status', ['publish', 'draft', 'trash'])->default('draft')->index('status');
            $table->datetime('created')->nullable();
            $table->datetime('last_updated_at')->nullable();
            $table->longText('extra_information')->nullable()->comment('Any Other Extra Info');
            $table->timestamps();
            $table->string('currency', 10)->nullable();
            $table->index(['vendor', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('giftcard_brands');
    }
}
