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
        # COMMENTED THIS CODE, FOR EXISTING MIGRATION IN BELOE FILE
        # database\migrations\2024_04_08_125854_create_permission_tables.php

        // Schema::table('model_has_roles', function (Blueprint $table) {
        //     $table->foreign(['role_id'])->references(['id'])->on('roles')->onUpdate('no action')->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('model_has_roles', function (Blueprint $table) {
        //     $table->dropForeign('model_has_roles_role_id_foreign');
        // });
    }
};
