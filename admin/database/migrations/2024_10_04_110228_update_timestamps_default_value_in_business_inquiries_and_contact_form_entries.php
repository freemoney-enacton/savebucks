<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateTimestampsDefaultValueInBusinessInquiriesAndContactFormEntries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Modify business_inquiries table
        DB::statement("ALTER TABLE `business_inquiries`
            MODIFY `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            MODIFY `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

        // Modify contact_form_entries table
        DB::statement("ALTER TABLE `contact_form_entries`
            MODIFY `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            MODIFY `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert business_inquiries table
        DB::statement("ALTER TABLE `business_inquiries`
            MODIFY `created_at` TIMESTAMP NULL DEFAULT NULL,
            MODIFY `updated_at` TIMESTAMP NULL DEFAULT NULL");

        // Revert contact_form_entries table
        DB::statement("ALTER TABLE `contact_form_entries`
            MODIFY `created_at` TIMESTAMP NULL DEFAULT NULL,
            MODIFY `updated_at` TIMESTAMP NULL DEFAULT NULL");
    }
}
