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
        Schema::create('user_task_clicks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->index();
            $table->char('platform', 50);
            $table->char('task_type', 25)->index();
            $table->char('network', 25)->index();
            $table->char('task_offer_id', 50)->nullable()->index();
            $table->char('campaign_id', 50)->index();
            $table->timestamp('clicked_on')->useCurrent()->index();
            $table->string('countries');
            $table->string('locale');
            $table->string('Referer');
            $table->string('user_agent');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->index(['network', 'campaign_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_task_clicks');
    }
};
