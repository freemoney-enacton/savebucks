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
        // Auth Logs
        Schema::table('auth_logs', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('created_at');
            $table->index('ip');
            $table->index(['user_id', 'created_at']);
        });

        // Banners
        Schema::table('banners', function (Blueprint $table) {
            $table->index('status');
            
        });

        // Blocks
        Schema::table('blocks', function (Blueprint $table) {
            $table->index('status');
            $table->index('purpose');
            
        });

        // Bonus Codes
        Schema::table('bonus_codes', function (Blueprint $table) {
            $table->index('code');
            $table->index('enabled');
            
        });

        // Bonus Types
        Schema::table('bonus_types', function (Blueprint $table) {
            $table->index('code');
            $table->index('enabled');
        });

        // Business Inquiries
        Schema::table('business_inquiries', function (Blueprint $table) {
            $table->index('email');
            $table->index('reason');
            $table->index('created_at');
        });

        // Cache
        Schema::table('cache', function (Blueprint $table) {
            $table->index('expiration');
        });

        // Cache Locks
        Schema::table('cache_locks', function (Blueprint $table) {
            $table->index('expiration');
        });

        // Contact Form Entries
        Schema::table('contact_form_entries', function (Blueprint $table) {
            $table->index('email');
            $table->index('reason');
            $table->index('created_at');
        });

        // Countries
        Schema::table('countries', function (Blueprint $table) {
            $table->index('code');
            $table->index('is_enabled');
            $table->index('default_language');
        });

        // Currencies
        Schema::table('currencies', function (Blueprint $table) {
            $table->index('iso_code');
            $table->index('enabled');
        });

        // Daily Bonus Ladder Configurations
        Schema::table('daily_bonus_ladder_configurations', function (Blueprint $table) {
            $table->index('step');
            $table->index('enabled');
        });

        // Email Templates
        Schema::table('email_templates', function (Blueprint $table) {
            $table->index('slug');
        });

        // Fabricator Pages
        Schema::table('fabricator_pages', function (Blueprint $table) {
            $table->index('slug');
            $table->index('status');
        });

        // Failed Jobs
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->index('failed_at');
            $table->index('queue');
            $table->index('connection');
        });

        // FAQ Categories
        Schema::table('faq_categories', function (Blueprint $table) {
            $table->index('category_code');
            $table->index('sort_order');
        });

        // FAQs
        Schema::table('faqs', function (Blueprint $table) {
            $table->index('category_code');
            $table->index('status');
            $table->index('sort_order');
            $table->index(['category_code', 'status', 'sort_order']);
        });

        // Footers
        Schema::table('footers', function (Blueprint $table) {
            $table->index('footer_type');
            $table->index('status');
            $table->index('sort_order');
        });

        // Job Batches
        Schema::table('job_batches', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('finished_at');
            $table->index('cancelled_at');
        });

        // Jobs
        Schema::table('jobs', function (Blueprint $table) {
            $table->index('available_at');
            $table->index('reserved_at');
            $table->index('created_at');
            $table->index(['queue', 'available_at']);
        });

        // Language Lines
        Schema::table('language_lines', function (Blueprint $table) {
            $table->index('key');
            $table->index(['group', 'key']);
        });

        // Languages
        Schema::table('languages', function (Blueprint $table) {
            $table->index('code');
            $table->index('is_enabled');
        });

        // Leaderboard Entries
        Schema::table('leaderboard_entries', function (Blueprint $table) {
            $table->index('leaderboard_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('rank');
            $table->index(['leaderboard_id', 'status']);
            $table->index(['leaderboard_id', 'rank']);
        });

        // Leaderboard Runs
        Schema::table('leaderboard_runs', function (Blueprint $table) {
            $table->index('status');
            $table->index('code');
            $table->index('frequency');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('awarded_at');
            $table->index(['status', 'frequency']);
        });

        // Leaderboard Settings
        Schema::table('leaderboard_settings', function (Blueprint $table) {
            $table->index('code');
            $table->index('is_enabled');
            $table->index('frequency');
        });

        // Media
        Schema::table('media', function (Blueprint $table) {
            $table->index('type');
            $table->index('disk');
            $table->index('visibility');
            $table->index('tenant_id');
            $table->index('created_at');
        });

        // Menus
        Schema::table('menus', function (Blueprint $table) {
            $table->index('status');
        });

        // Messages
        Schema::table('messages', function (Blueprint $table) {
            $table->index('sent_at');
            $table->index('user_tier');
            $table->index('is_hidden');
            $table->index('user_private');
            $table->index(['room_code', 'sent_at']);
            $table->index(['user_id', 'sent_at']);
        });

        // Notification Templates
        Schema::table('notification_templates', function (Blueprint $table) {
            $table->index('template_code');
        });

        // Notifications
        Schema::table('notifications', function (Blueprint $table) {
            $table->index('type');
            $table->index('read_at');
            $table->index('created_at');
        });

        // Offerwall Categories
        Schema::table('offerwall_categories', function (Blueprint $table) {
            $table->index('slug');
            $table->index('is_enabled');
            $table->index('is_featured');
            $table->index('sort_order');
            $table->index('mapping_for');
            $table->index('show_menu');
            $table->index(['is_enabled', 'sort_order']);
        });

        // Offerwall Networks
        Schema::table('offerwall_networks', function (Blueprint $table) {
            $table->index('code');
            $table->index('enabled');
            $table->index('type');
            $table->index('is_featured');
            $table->index('sort_order');
            $table->index('render_type');
            $table->index('task_iframe_only');
            $table->index(['enabled', 'sort_order']);
        });

        // Offerwall Postback Logs
        Schema::table('offerwall_postback_logs', function (Blueprint $table) {
            $table->index('network');
            $table->index('transaction_id');
            $table->index('status');
            $table->index('created_at');
            $table->index(['network', 'transaction_id']);
        });

        // Offerwall Task Goals
        Schema::table('offerwall_task_goals', function (Blueprint $table) {
            $table->index('network');
            $table->index('status');
            $table->index('is_translated');
            $table->index(['network', 'status']);
        });

        // Offerwall Tasks
        Schema::table('offerwall_tasks', function (Blueprint $table) {
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_translated');
            $table->index('tier');
            $table->index('offer_type');
            $table->index('tracking_speed');
            $table->index('payout_type');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('created_at');
            $table->index(['status', 'is_featured']);
            $table->index(['network', 'status']);
            $table->index(['category_id', 'status']);
        });

        // Pages
        Schema::table('pages', function (Blueprint $table) {
            $table->index('status');
            $table->index('parent_id');
            $table->index('created_at');
        });

        // Password Reset Tokens
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->index('created_at');
        });

        // Payment Types
        Schema::table('payment_types', function (Blueprint $table) {
            $table->index('enabled');
            $table->index('cashback_allowed');
            $table->index('bonus_allowed');
            $table->index('country_customizable');
            $table->index('conversion_enabled');
        });

        // PayPal Logs
        Schema::table('paypal_logs', function (Blueprint $table) {
            $table->index('success');
            $table->index('status_code');
            $table->index('created_at');
        });

        // Personal Access Tokens
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->index('last_used_at');
            $table->index('expires_at');
            $table->index('created_at');
        });

        // Rooms
        Schema::table('rooms', function (Blueprint $table) {
            $table->index('enabled');
            $table->index('tier');
        });

        // Sessions
        Schema::table('sessions', function (Blueprint $table) {
            $table->index('ip_address');
        });

        // Settings
        Schema::table('settings', function (Blueprint $table) {
            $table->index('group');
            $table->index(['group', 'name']);
        });

        // Spin Configuration
        Schema::table('spin_configuration', function (Blueprint $table) {
            $table->index('spin_code');
            $table->index('code');
            $table->index('enabled');
        });

        // Spins
        Schema::table('spins', function (Blueprint $table) {
            $table->index('code');
            $table->index('enabled');
            $table->index('variable_rewards');
        });

        // Streak Configurations
        Schema::table('streak_configurations', function (Blueprint $table) {
            $table->index('day');
            $table->index('reward_type');
            $table->index('enabled');
            $table->index(['enabled', 'day']);
        });

        // Tickers
        Schema::table('tickers', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('ticker_type');
            $table->index('created_at');
            $table->index(['user_id', 'ticker_type']);
        });

        // Tiers
        Schema::table('tiers', function (Blueprint $table) {
            $table->index('tier');
            $table->index('enabled');
        });

        // Tremendous Logs
        Schema::table('tremendous_logs', function (Blueprint $table) {
            $table->index('request_type');
            $table->index('success');
            $table->index('status_code');
            $table->index('created_at');
        });

        // User Activities
        Schema::table('user_activities', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('activity_type');
            $table->index('status');
            $table->index('created_at');
            $table->index(['user_id', 'activity_type']);
            $table->index(['user_id', 'created_at']);
        });

        // User Bonus
        Schema::table('user_bonus', function (Blueprint $table) {
            $table->index('bonus_code');
            $table->index('status');
            $table->index('awarded_on');
            $table->index('expires_on');
            $table->index(['user_id', 'status']);
            $table->index(['status', 'expires_on']);
        });

        // User Bonus Code Redemptions
        Schema::table('user_bonus_code_redemptions', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('bonus_code');
            $table->index(['user_id', 'bonus_code']);
        });

        // User Daily Bonus Ladder
        Schema::table('user_daily_bonus_ladder', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('status');
            $table->index('expires_at');
            $table->index('claimed_at');
            $table->index(['user_id', 'status']);
        });

        // User Demographics
        Schema::table('user_demographics', function (Blueprint $table) {
            $table->index('is_completed');
            $table->index('voqall_user_id');
        });

        // User Notifications
        Schema::table('user_notifications', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('is_read');
            $table->index('route');
            $table->index('created_at');
            $table->index(['user_id', 'is_read']);
        });

        // User Offerwall Sales
        Schema::table('user_offerwall_sales', function (Blueprint $table) {
            $table->index('network');
            $table->index('task_type');
            $table->index('mail_sent');
            $table->index('is_chargeback');
            $table->index('created_at');
            $table->index(['user_id', 'network']);
            $table->index(['network', 'created_at']);
        });

        // User OTP
        Schema::table('user_otp', function (Blueprint $table) {
            $table->index('email');
            $table->index('phone_no');
            $table->index('expiration');
        });

        // User Payment Modes
        Schema::table('user_payment_modes', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('payment_method_code');
            $table->index('enabled');
            $table->index(['user_id', 'enabled']);
        });

        // User Payments
        Schema::table('user_payments', function (Blueprint $table) {
            $table->index('status');
            $table->index('paid_at');
            $table->index('created_at');
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });

        // User Referral Earnings
        Schema::table('user_referral_earnings', function (Blueprint $table) {
            $table->index('referee_id');
            $table->index('status');
            $table->index('network');
            $table->index('transaction_time');
            $table->index(['user_id', 'status']);
            $table->index(['referee_id', 'status']);
        });

        // User Spins
        Schema::table('user_spins', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('code');
            $table->index('source');
            $table->index('spin_code');
            $table->index('status');
            $table->index('awarded_at');
            $table->index('expires_at');
            $table->index(['user_id', 'status']);
        });

        // User Streaks
        Schema::table('user_streaks', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('day');
            $table->index('reward_type');
            $table->index(['user_id', 'day']);
        });

        // User Task Clicks
        Schema::table('user_task_clicks', function (Blueprint $table) {
            $table->index('platform');
            $table->index('converted');
            $table->index('created_at');
            $table->index(['user_id', 'network']);
            $table->index(['network', 'clicked_on']);
        });

        // User Tasks
        Schema::table('user_tasks', function (Blueprint $table) {
            $table->index('network');
            $table->index('task_type');
            $table->index('mail_sent');
            $table->index('created_at');
            $table->index(['user_id', 'network']);
            $table->index(['network', 'created_at']);
        });

        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->index('email');
            $table->index('referral_code');
            $table->index('referrer_code');
            $table->index('status');
            $table->index('is_deleted');
            $table->index('deleted_at');
            $table->index('country_code');
            $table->index('current_tier');
            $table->index('current_level');
            $table->index('is_email_verified');
            $table->index('is_phone_no_verified');
            $table->index('voqall_user_id');
            $table->index('created_at');
            $table->index(['status', 'is_deleted']);
            $table->index(['country_code', 'status']);
        });

       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
    }
};