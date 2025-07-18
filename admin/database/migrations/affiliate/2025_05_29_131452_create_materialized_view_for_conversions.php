<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'affiliate';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection('affiliate')->getDriverName();

        if ($driver === 'mysql') {
            $this->createMysqlView();
        } elseif ($driver === 'pgsql') {
            $this->createPostgresView();
        }
    }

    /**
     * Create MySQL view (regular view, not materialized)
     */
    private function createMysqlView(): void
    {
        // Drop existing view if it exists
        DB::connection('affiliate')->statement('DROP VIEW IF EXISTS vw_affiliate_conversions');

        // Create regular view for MySQL
        DB::connection('affiliate')->statement("
            CREATE VIEW vw_affiliate_conversions AS
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
                
                -- Calculated fields (MySQL compatible)
                TIMESTAMPDIFF(HOUR, cl.clicked_at, c.converted_at) AS hours_to_conversion,
                YEAR(c.converted_at) AS conversion_year

            FROM conversions c
                INNER JOIN campaigns camp ON c.campaign_id = camp.id
                INNER JOIN campaign_goals cg ON c.campaign_goal_id = cg.id
                INNER JOIN affiliates a ON c.affiliate_id = a.id
                INNER JOIN clicks cl ON c.click_code = cl.click_code
                INNER JOIN affiliate_links al ON cl.affiliate_link_id = al.id
        ");

        $this->createMysqlIndexes();
    }

    /**
     * Create PostgreSQL materialized view
     */
    private function createPostgresView(): void
    {
        // Drop existing materialized view if it exists
        DB::connection('affiliate')->statement('DROP MATERIALIZED VIEW IF EXISTS vw_affiliate_conversions CASCADE');

        // Create materialized view with comprehensive conversion data
        DB::connection('affiliate')->statement("
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

        $this->createPostgresIndexes();
    }

    /**
     * Create MySQL indexes
     */
    private function createMysqlIndexes(): void
    {
        // Single column indexes
        $indexes = [
            'idx_conv_summary_conversion_id' => 'conversion_id',
            'idx_conv_summary_transaction_id' => 'transaction_id',
            'idx_conv_summary_click_code' => 'click_code',
            'idx_conv_summary_campaign_id' => 'campaign_id',
            'idx_conv_summary_affiliate_id' => 'affiliate_id',
            'idx_conv_summary_goal_id' => 'campaign_goal_id',
            'idx_conv_summary_link_id' => 'affiliate_link_id',
            'idx_conv_summary_click_id' => 'click_id',
            'idx_conv_summary_conversion_status' => 'conversion_status',
            'idx_conv_summary_campaign_status' => 'campaign_status',
            'idx_conv_summary_affiliate_status' => 'affiliate_status',
            'idx_conv_summary_converted_at' => 'converted_at',
            'idx_conv_summary_clicked_at' => 'clicked_at',
            'idx_conv_summary_country' => 'country',
            'idx_conv_summary_commission' => 'commission',
            'idx_conv_summary_conversion_value' => 'conversion_value',
        ];

        foreach ($indexes as $indexName => $column) {
            try {
                DB::connection('affiliate')->statement("CREATE INDEX {$indexName} ON vw_affiliate_conversions ({$column})");
            } catch (\Exception $e) {
                // Index might already exist, continue
            }
        }

        // Composite indexes
        $compositeIndexes = [
            'idx_conv_summary_affiliate_campaign' => '(affiliate_id, campaign_id)',
            'idx_conv_summary_affiliate_status_comp' => '(affiliate_id, conversion_status)',
            'idx_conv_summary_affiliate_goal' => '(affiliate_id, campaign_goal_id)',
            'idx_conv_summary_campaign_status_comp' => '(campaign_id, conversion_status)',
            'idx_conv_summary_campaign_goal' => '(campaign_id, campaign_goal_id)',
            'idx_conv_summary_status_commission' => '(conversion_status, commission)',
            'idx_conv_summary_affiliate_commission' => '(affiliate_id, commission)',
            'idx_conv_summary_campaign_value' => '(campaign_id, conversion_value)',
        ];

        foreach ($compositeIndexes as $indexName => $columns) {
            try {
                DB::connection('affiliate')->statement("CREATE INDEX {$indexName} ON vw_affiliate_conversions {$columns}");
            } catch (\Exception $e) {
                // Index might already exist, continue
            }
        }
    }

    /**
     * Create PostgreSQL indexes
     */
    private function createPostgresIndexes(): void
    {
        // Single column indexes
        $indexes = [
            'idx_conv_summary_conversion_id' => 'conversion_id',
            'idx_conv_summary_transaction_id' => 'transaction_id',
            'idx_conv_summary_click_code' => 'click_code',
            'idx_conv_summary_campaign_id' => 'campaign_id',
            'idx_conv_summary_affiliate_id' => 'affiliate_id',
            'idx_conv_summary_goal_id' => 'campaign_goal_id',
            'idx_conv_summary_link_id' => 'affiliate_link_id',
            'idx_conv_summary_click_id' => 'click_id',
            'idx_conv_summary_conversion_status' => 'conversion_status',
            'idx_conv_summary_campaign_status' => 'campaign_status',
            'idx_conv_summary_affiliate_status' => 'affiliate_status',
            'idx_conv_summary_converted_at' => 'converted_at',
            'idx_conv_summary_clicked_at' => 'clicked_at',
            'idx_conv_summary_country' => 'country',
            'idx_conv_summary_commission' => 'commission',
            'idx_conv_summary_conversion_value' => 'conversion_value',
        ];

        foreach ($indexes as $indexName => $column) {
            DB::connection('affiliate')->statement("DROP INDEX IF EXISTS {$indexName}");
            DB::connection('affiliate')->statement("CREATE INDEX {$indexName} ON vw_affiliate_conversions ({$column})");
        }

        // Composite indexes
        $compositeIndexes = [
            'idx_conv_summary_affiliate_campaign' => '(affiliate_id, campaign_id)',
            'idx_conv_summary_affiliate_status_comp' => '(affiliate_id, conversion_status)',
            'idx_conv_summary_affiliate_goal' => '(affiliate_id, campaign_goal_id)',
            'idx_conv_summary_campaign_status_comp' => '(campaign_id, conversion_status)',
            'idx_conv_summary_campaign_goal' => '(campaign_id, campaign_goal_id)',
            'idx_conv_summary_status_commission' => '(conversion_status, commission)',
            'idx_conv_summary_affiliate_commission' => '(affiliate_id, commission)',
            'idx_conv_summary_campaign_value' => '(campaign_id, conversion_value)',
        ];

        foreach ($compositeIndexes as $indexName => $columns) {
            DB::connection('affiliate')->statement("DROP INDEX IF EXISTS {$indexName}");
            DB::connection('affiliate')->statement("CREATE INDEX {$indexName} ON vw_affiliate_conversions {$columns}");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection('affiliate')->getDriverName();

        if ($driver === 'mysql') {
            DB::connection('affiliate')->statement('DROP VIEW IF EXISTS vw_affiliate_conversions');
        } elseif ($driver === 'pgsql') {
            DB::connection('affiliate')->statement('DROP MATERIALIZED VIEW IF EXISTS vw_affiliate_conversions CASCADE');
        }
    }
};
