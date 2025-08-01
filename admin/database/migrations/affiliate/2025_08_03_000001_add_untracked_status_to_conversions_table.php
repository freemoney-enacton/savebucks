<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $connection = 'affiliate';

    public function up(): void
    {
        DB::statement("ALTER TABLE conversions MODIFY status ENUM('pending','approved','declined','paid','untracked') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE conversions MODIFY status ENUM('pending','approved','declined','paid') DEFAULT 'pending'");
    }
};
