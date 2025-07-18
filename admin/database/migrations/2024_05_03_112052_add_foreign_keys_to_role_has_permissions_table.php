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

        // Schema::table('role_has_permissions', function (Blueprint $table) {
        //     $table->foreign(['permission_id'])->references(['id'])->on('permissions')->onUpdate('no action')->onDelete('cascade');
        //     $table->foreign(['role_id'])->references(['id'])->on('roles')->onUpdate('no action')->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('role_has_permissions', function (Blueprint $table) {
        //     $table->dropForeign('role_has_permissions_permission_id_foreign');
        //     $table->dropForeign('role_has_permissions_role_id_foreign');
        // });
    }
};
