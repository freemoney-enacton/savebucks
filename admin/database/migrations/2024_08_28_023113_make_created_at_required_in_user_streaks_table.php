<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user_streaks', function (Blueprint $table) {
            $table->dropColumn('created_at');
        });

        Schema::table('user_streaks', function (Blueprint $table) {
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::table('user_streaks', function (Blueprint $table) {
            $table->dropColumn('created_at');
        });

        Schema::table('user_streaks', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable();
        });
    }

    // /**
    //  * Run the migrations.
    //  */
    // public function up(): void
    // {
    //     Schema::table('user_streaks', function (Blueprint $table) {
    //         $table->timestamp('created_at')->nullable(false)->useCurrent()->change();
    //     });
    // }

    // /**
    //  * Reverse the migrations.
    //  */
    // public function down(): void
    // {
    //     Schema::table('user_streaks', function (Blueprint $table) {
    //         $table->timestamp('created_at')->nullable()->change();
    //     });
    // }
};
