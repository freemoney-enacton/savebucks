<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   protected $connection = 'affiliate';
   
   /**
    * Run the migrations.
    */
   public function up(): void
   {
       // Clean existing data - remove trailing spaces
       DB::connection('affiliate')->statement("UPDATE campaign_goals SET tracking_code = TRIM(tracking_code) WHERE tracking_code IS NOT NULL");

       // Change column from CHARACTER(255) to VARCHAR(255)
       DB::connection('affiliate')->statement('ALTER TABLE campaign_goals ALTER COLUMN tracking_code TYPE VARCHAR(255)');
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
       // Revert back to CHARACTER(255) - will pad with spaces again
       DB::connection('affiliate')->statement('ALTER TABLE campaign_goals ALTER COLUMN tracking_code TYPE CHARACTER(255)');
   }
};
