<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW vw_user_earnings_report AS
                WITH task_earnings AS (
                    SELECT
                        user_id,
                        COUNT(DISTINCT task_offer_id) AS total_tasks,
                        SUM(CASE WHEN task_type = 'survey' THEN 1 ELSE 0 END) AS surveys_completed,
                        SUM(CASE WHEN status IN ('pending', 'confirmed') THEN amount ELSE 0 END) AS total_earnings,
                        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_amount,
                        SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) AS confirmed_amount,
                        SUM(CASE WHEN status = 'declined' THEN amount ELSE 0 END) AS declined_amount
                    FROM user_offerwall_sales
                    GROUP BY user_id
                ),
                bonus_earnings AS (
                    SELECT
                        user_id,
                        SUM(CASE WHEN status IN ('pending', 'confirmed') THEN amount ELSE 0 END) AS total_bonus,
                        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_bonus,
                        SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) AS confirmed_bonus,
                        SUM(CASE WHEN status = 'declined' THEN amount ELSE 0 END) AS declined_bonus,
                        SUM(CASE WHEN status = 'expired' THEN amount ELSE 0 END) AS expired_bonus
                    FROM user_bonus
                    GROUP BY user_id
                ),
                referral_earnings AS (
                    SELECT
                        user_id,
                        SUM(CASE WHEN status IN ('pending', 'confirmed') THEN amount ELSE 0 END) AS total_referral_earnings,
                        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_referral,
                        SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) AS confirmed_referral,
                        SUM(CASE WHEN status = 'declined' THEN amount ELSE 0 END) AS declined_referral
                    FROM user_referral_earnings
                    GROUP BY user_id
                ),
                withdrawal_info AS (
                    SELECT
                        user_id,
                        SUM(CASE WHEN status IN ('created', 'processing') THEN 1 ELSE 0 END) AS pending_withdrawals_count,
                        SUM(CASE WHEN status IN ('created', 'processing') THEN amount ELSE 0 END) AS pending_withdrawals_amount,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS withdrawn_count,
                        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS withdrawn_amount,
                        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declined_withdrawals_count,
                        SUM(CASE WHEN status = 'declined' THEN amount ELSE 0 END) AS declined_withdrawals_amount,
                        SUM(CASE WHEN status IN ('created', 'processing', 'completed') THEN amount ELSE 0 END) AS total_withdrawals_amount
                    FROM user_payments
                    GROUP BY user_id
                )
                SELECT
                    u.id AS user_id,
                    u.name,
                    u.email,
                    u.phone_no,
                    u.current_tier,
                    u.current_level,
                    u.deleted_at,
                    COALESCE(te.total_tasks, 0) AS total_tasks,
                    COALESCE(te.surveys_completed, 0) AS surveys_completed,
                    COALESCE(te.total_earnings, 0) AS total_task_earnings,
                    COALESCE(te.pending_amount, 0) AS pending_task_earnings,
                    COALESCE(te.confirmed_amount, 0) AS confirmed_task_earnings,
                    COALESCE(te.declined_amount, 0) AS declined_task_earnings,
                    COALESCE(be.total_bonus, 0) AS total_bonus,
                    COALESCE(be.pending_bonus, 0) AS pending_bonus,
                    COALESCE(be.confirmed_bonus, 0) AS confirmed_bonus,
                    COALESCE(be.declined_bonus, 0) AS declined_bonus,
                    COALESCE(be.expired_bonus, 0) AS expired_bonus,
                    COALESCE(re.total_referral_earnings, 0) AS total_referral_earnings,
                    COALESCE(re.pending_referral, 0) AS pending_referral_earnings,
                    COALESCE(re.confirmed_referral, 0) AS confirmed_referral_earnings,
                    COALESCE(re.declined_referral, 0) AS declined_referral_earnings,
                    COALESCE(wi.pending_withdrawals_count, 0) AS pending_withdrawals_count,
                    COALESCE(wi.pending_withdrawals_amount, 0) AS pending_withdrawals_amount,
                    COALESCE(wi.withdrawn_count, 0) AS withdrawn_count,
                    COALESCE(wi.withdrawn_amount, 0) AS withdrawn_amount,
                    COALESCE(wi.declined_withdrawals_count, 0) AS declined_withdrawals_count,
                    COALESCE(wi.declined_withdrawals_amount, 0) AS declined_withdrawals_amount,
                    COALESCE(wi.total_withdrawals_amount, 0) AS total_withdrawals_amount,
                    (COALESCE(te.total_earnings, 0) + COALESCE(be.total_bonus, 0) + COALESCE(re.total_referral_earnings, 0)) AS total_earnings,
                    (COALESCE(te.total_earnings, 0) + COALESCE(be.total_bonus, 0) + COALESCE(re.total_referral_earnings, 0) - COALESCE(wi.total_withdrawals_amount, 0)) AS current_balance
                FROM
                    users u
                LEFT JOIN task_earnings te ON u.id = te.user_id
                LEFT JOIN bonus_earnings be ON u.id = be.user_id
                LEFT JOIN referral_earnings re ON u.id = re.user_id
                LEFT JOIN withdrawal_info wi ON u.id = wi.user_id
                ORDER BY u.id DESC;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS vw_user_earnings_report");
    }
};
