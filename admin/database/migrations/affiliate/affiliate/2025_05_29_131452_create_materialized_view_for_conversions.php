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
        // Drop existing materialized view if it exists
        DB::statement('DROP MATERIALIZED VIEW IF EXISTS vw_affiliate_conversions CASCADE');

        // Create materialized view with comprehensive conversion data
        DB::statement("
            CREATE MATERIALIZED VIEW vw_affiliate_conversions AS
            SELECT 
                -- Conversion core data
                c.id AS conversion_id,
                c.transaction_id,
                c.click_code,
                c.conversion_value,
                c.commission,
                c.status AS conversion_status,
                c.converted_at,
                c.created_at AS conversion_created_at,
                c.sub1 AS conversion_sub1,
                c.sub2 AS conversion_sub2,
                c.sub3 AS conversion_sub3,
                c.admin_notes,
                c.payout_id,
                
                -- Campaign information
                camp.id AS campaign_id,
                camp.name AS campaign_name,
                camp.campaign_type,
                camp.status AS campaign_status,
                
                -- Campaign Goal information
                cg.id AS campaign_goal_id,
                cg.name AS goal_name,
                cg.commission_type,
                cg.commission_amount AS goal_commission_amount,
                cg.tracking_code,
                cg.status AS goal_status,
                
                -- Affiliate information
                a.id AS affiliate_id,
                a.name AS affiliate_name,
                a.email AS affiliate_email,
                a.approval_status AS affiliate_status,
                
                -- Affiliate Link information
                al.id AS affiliate_link_id,
                al.slug AS link_slug,
                al.destination_url,
                al.status AS link_status,
                al.sub1 AS link_sub1,
                al.sub2 AS link_sub2,
                al.sub3 AS link_sub3,
                
                -- Click information
                cl.id AS click_id,
                cl.ip_address,
                cl.country,
                cl.city,
                cl.device_type,
                cl.referrer,
                cl.clicked_at,
                cl.sub1 AS click_sub1,
                cl.sub2 AS click_sub2,
                cl.sub3 AS click_sub3,
                
                -- Calculated fields
                EXTRACT(EPOCH FROM (c.converted_at - cl.clicked_at))/3600 AS hours_to_conversion,
                DATE_TRUNC('year', c.converted_at) AS conversion_year

            FROM conversions c
                INNER JOIN campaigns camp ON c.campaign_id = camp.id
                INNER JOIN campaign_goals cg ON c.campaign_goal_id = cg.id
                INNER JOIN affiliates a ON c.affiliate_id = a.id
                INNER JOIN clicks cl ON c.click_code = cl.click_code
                INNER JOIN affiliate_links al ON cl.affiliate_link_id = al.id
        ");

        // Create indexes for optimal query performance
        $indexes = [
            // Primary key indexes
            'idx_conv_summary_conversion_id' => 'conversion_id',
            'idx_conv_summary_transaction_id' => 'transaction_id',
            'idx_conv_summary_click_code' => 'click_code',
            'idx_conv_summary_campaign_id' => 'campaign_id',
            'idx_conv_summary_affiliate_id' => 'affiliate_id',
            'idx_conv_summary_goal_id' => 'campaign_goal_id',
            'idx_conv_summary_link_id' => 'affiliate_link_id',
            'idx_conv_summary_click_id' => 'click_id',
            
            // Status-based indexes
            'idx_conv_summary_conversion_status' => 'conversion_status',
            'idx_conv_summary_campaign_status' => 'campaign_status',
            'idx_conv_summary_affiliate_status' => 'affiliate_status',
            
            // Date-based indexes for time-series queries
            'idx_conv_summary_converted_at' => 'converted_at',
            
            
            'idx_conv_summary_clicked_at' => 'clicked_at',
            
            // Location-based indexes
            'idx_conv_summary_country' => 'country',
            
            // Performance optimization indexes
            'idx_conv_summary_commission' => 'commission',
            'idx_conv_summary_conversion_value' => 'conversion_value',
        ];

        foreach ($indexes as $indexName => $column) {
                DB::statement("DROP INDEX IF EXISTS {$indexName}");
            DB::statement("CREATE INDEX  {$indexName} ON vw_affiliate_conversions ({$column})");
        }

                    // Composite indexes for common query patterns
            $compositeIndexes = [
           
            
            // Affiliate performance tracking
            'idx_conv_summary_affiliate_campaign' => '(affiliate_id, campaign_id)',
            'idx_conv_summary_affiliate_status' => '(affiliate_id, conversion_status)',
            'idx_conv_summary_affiliate_goal' => '(affiliate_id, campaign_goal_id)',
            
            // Campaign performance
            'idx_conv_summary_campaign_status' => '(campaign_id, conversion_status)',
            'idx_conv_summary_campaign_goal' => '(campaign_id, campaign_goal_id)',
            
            // Financial reporting
            'idx_conv_summary_status_commission' => '(conversion_status, commission)',
            'idx_conv_summary_affiliate_commission' => '(affiliate_id, commission)',
            'idx_conv_summary_campaign_value' => '(campaign_id, conversion_value)',
            
            // Attribution tracking
            'idx_conv_summary_link_click' => '(affiliate_link_id, click_id)',
            'idx_conv_summary_click_conversion' => '(click_code, conversion_status)',
            
            // Sub-parameter analysis
            'idx_conv_summary_subs' => '(conversion_sub1, conversion_sub2, conversion_sub3)',
            'idx_conv_summary_link_subs' => '(link_sub1, link_sub2, link_sub3)',
            
            // Payout processing
            'idx_conv_summary_payout_status' => '(payout_id, conversion_status)',
            'idx_conv_summary_affiliate_payout' => '(affiliate_id, payout_id)',
            
            // Traffic source analysis
            'idx_conv_summary_referrer_country' => '(referrer, country)',
            'idx_conv_summary_device_status' => '(device_type, conversion_status)',
            ];

        foreach ($compositeIndexes as $indexName => $columns) {
                DB::statement("DROP INDEX IF EXISTS {$indexName}");

            DB::statement("CREATE INDEX  {$indexName} ON vw_affiliate_conversions {$columns}");
        }

       
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
        // Drop the materialized view
        DB::statement('DROP MATERIALIZED VIEW IF EXISTS vw_affiliate_conversions CASCADE');
    }
};