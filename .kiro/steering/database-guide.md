# Database Design & Migration Guide

## Database Architecture Overview

The SaveBucks platform uses a dual-database architecture:

- **MySQL Database**: Primary database for the core platform (admin panel, API server, web frontend) supporting users, offers, transactions, gamification, and content management
- **PostgreSQL Database**: Dedicated database for the affiliate panel supporting affiliate management, campaigns, conversions, and payouts

Both databases are designed with proper referential integrity, performance optimization, and scalability in mind.

### Core Design Principles
- **Referential Integrity**: All foreign keys with proper constraints
- **Data Consistency**: ACID compliance with proper transactions
- **Performance**: Strategic indexing and query optimization
- **Scalability**: Designed for horizontal scaling
- **Audit Trail**: Comprehensive logging of important changes
- **Soft Deletes**: Preserve data integrity for critical entities

## Schema Organization

### Core Entities

#### Users & Authentication
```sql
-- Users table (main user accounts)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'pending_verification',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    referral_code VARCHAR(20) UNIQUE,
    referred_by_id BIGINT UNSIGNED,
    balance DECIMAL(10,2) DEFAULT 0.00,
    lifetime_earnings DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_referral_code (referral_code),
    INDEX idx_referred_by (referred_by_id),
    FOREIGN KEY (referred_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- User sessions for tracking active sessions
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Offers & Networks
```sql
-- Affiliate networks
CREATE TABLE networks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    api_endpoint VARCHAR(500),
    api_credentials JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Offer categories
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    parent_id BIGINT UNSIGNED,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_sort_order (sort_order),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Main offers table
CREATE TABLE offers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    network_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    external_id VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    terms_and_conditions TEXT,
    image_url VARCHAR(500),
    click_url TEXT NOT NULL,
    reward_type ENUM('fixed', 'percentage') NOT NULL,
    reward_value DECIMAL(10,2) NOT NULL,
    minimum_payout DECIMAL(10,2) DEFAULT 0.00,
    maximum_payout DECIMAL(10,2),
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'draft', 'expired') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    countries JSON, -- Array of allowed country codes
    devices JSON,   -- Array of allowed devices (mobile, desktop, tablet)
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_network_id (network_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_priority (priority),
    INDEX idx_dates (start_date, end_date),
    FOREIGN KEY (network_id) REFERENCES networks(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
```

#### Transactions & Earnings
```sql
-- User offer clicks tracking
CREATE TABLE user_offer_clicks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    offer_id BIGINT UNSIGNED NOT NULL,
    click_id VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer_url VARCHAR(1000),
    device_info JSON,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_offer_id (offer_id),
    INDEX idx_click_id (click_id),
    INDEX idx_clicked_at (clicked_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);

-- Sales/conversions from offers
CREATE TABLE user_offer_sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    offer_id BIGINT UNSIGNED NOT NULL,
    click_id BIGINT UNSIGNED,
    external_transaction_id VARCHAR(255),
    sale_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    user_earning DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    rejection_reason TEXT,
    conversion_data JSON,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_offer_id (offer_id),
    INDEX idx_click_id (click_id),
    INDEX idx_status (status),
    INDEX idx_sale_date (sale_date),
    INDEX idx_external_id (external_transaction_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
    FOREIGN KEY (click_id) REFERENCES user_offer_clicks(id) ON DELETE SET NULL
);

-- User payments/withdrawals
CREATE TABLE user_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    payment_method ENUM('paypal', 'bank_transfer', 'gift_card', 'crypto') NOT NULL,
    payment_details JSON NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    failure_reason TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_processed_at (processed_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Gamification
```sql
-- Leaderboard configurations
CREATE TABLE leaderboard_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('earnings', 'referrals', 'activities') NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'all_time') NOT NULL,
    start_date DATE,
    end_date DATE,
    prize_pool DECIMAL(10,2) DEFAULT 0.00,
    prizes JSON, -- Array of prize configurations
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_frequency (frequency),
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
);

-- Leaderboard entries
CREATE TABLE leaderboard_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    leaderboard_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    rank_position INT NOT NULL,
    prize_amount DECIMAL(10,2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_leaderboard_id (leaderboard_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rank (rank_position),
    INDEX idx_period (period_start, period_end),
    UNIQUE KEY unique_user_period (leaderboard_id, user_id, period_start, period_end),
    FOREIGN KEY (leaderboard_id) REFERENCES leaderboard_settings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily bonus configurations
CREATE TABLE daily_bonus_configurations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    day_number INT NOT NULL, -- 1-7 for weekly cycle
    bonus_amount DECIMAL(10,2) NOT NULL,
    bonus_type ENUM('fixed', 'percentage') DEFAULT 'fixed',
    multiplier DECIMAL(3,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_day (day_number),
    INDEX idx_active (is_active)
);

-- User daily bonus claims
CREATE TABLE user_daily_bonuses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    bonus_date DATE NOT NULL,
    day_number INT NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    streak_count INT DEFAULT 1,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_bonus_date (bonus_date),
    UNIQUE KEY unique_user_date (user_id, bonus_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## PostgreSQL Schema (Affiliate Panel)

### Affiliate Management Schema

```sql
-- Enums for PostgreSQL
CREATE TYPE approval_status AS ENUM ('approved', 'rejected', 'suspended', 'pending');
CREATE TYPE campaign_status AS ENUM ('active', 'paused', 'ended');
CREATE TYPE conversion_status AS ENUM ('pending', 'approved', 'declined', 'paid');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'rejected', 'paid');
CREATE TYPE postback_status AS ENUM ('success', 'failure', 'pending');
CREATE TYPE status AS ENUM ('active', 'inactive');

-- Affiliates table
CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    approval_status approval_status DEFAULT 'pending',
    paypal_address VARCHAR(255),
    bank_details JSONB,
    address JSONB,
    tax_id VARCHAR(255),
    token VARCHAR(255),
    token_expiry TIMESTAMP,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logo_url VARCHAR(255),
    campaign_type VARCHAR(255) NOT NULL,
    status campaign_status NOT NULL DEFAULT 'active',
    terms_and_conditions TEXT,
    terms_and_condition_url TEXT,
    min_payout_request NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Campaign goals table
CREATE TABLE campaign_goals (
    id SERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    commission_type VARCHAR(255) NOT NULL,
    commission_amount NUMERIC(10,2) NOT NULL,
    tracking_code CHAR(10) NOT NULL UNIQUE,
    status status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Affiliate campaign goals (many-to-many relationship)
CREATE TABLE affiliate_campaign_goals (
    id SERIAL PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,
    campaign_goal_id BIGINT NOT NULL,
    custom_commission_rate NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_goal_id) REFERENCES campaign_goals(id) ON DELETE CASCADE,
    UNIQUE(affiliate_id, campaign_id, campaign_goal_id)
);

-- Affiliate links table
CREATE TABLE affiliate_links (
    id SERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    affiliate_id BIGINT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    destination_url VARCHAR(1000) NOT NULL,
    sub1 VARCHAR(255),
    sub2 VARCHAR(255),
    sub3 VARCHAR(255),
    total_clicks BIGINT NOT NULL DEFAULT 0,
    total_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
    status status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

-- Clicks tracking table
CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    affiliate_link_id BIGINT NOT NULL,
    affiliate_id BIGINT NOT NULL,
    click_code VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(255) NOT NULL,
    user_agent VARCHAR(1000) NOT NULL,
    referrer VARCHAR(255),
    country VARCHAR(255),
    city VARCHAR(255),
    device_type VARCHAR(255),
    sub1 VARCHAR(255),
    sub2 VARCHAR(255),
    sub3 VARCHAR(255),
    is_converted BOOLEAN NOT NULL DEFAULT FALSE,
    clicked_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (affiliate_link_id) REFERENCES affiliate_links(id) ON DELETE CASCADE,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

-- Postback logs table
CREATE TABLE postback_logs (
    id SERIAL PRIMARY KEY,
    raw_postback_data JSONB NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status postback_status NOT NULL,
    status_messages JSONB,
    received_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP
);

-- Conversions table
CREATE TABLE conversions (
    id SERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    postback_log_id BIGINT NOT NULL,
    click_code VARCHAR(255) NOT NULL,
    campaign_goal_id BIGINT NOT NULL,
    affiliate_id BIGINT NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    conversion_value NUMERIC(12,2) NOT NULL,
    commission NUMERIC(12,2) NOT NULL,
    sub1 VARCHAR(255),
    sub2 VARCHAR(255),
    sub3 VARCHAR(255),
    status conversion_status NOT NULL DEFAULT 'pending',
    payout_id BIGINT,
    admin_notes VARCHAR(500),
    converted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (postback_log_id) REFERENCES postback_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_goal_id) REFERENCES campaign_goals(id) ON DELETE CASCADE,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

-- Payouts table
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    requested_amount NUMERIC(12,2) NOT NULL,
    status payout_status NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_account VARCHAR(255) NOT NULL,
    payment_details JSONB,
    admin_notes VARCHAR(500),
    transaction_id VARCHAR(255),
    api_response JSONB,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

-- Affiliate postbacks table
CREATE TABLE affiliate_postbacks (
    id SERIAL PRIMARY KEY,
    affiliate_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,
    campaign_goal_id BIGINT,
    postback_url VARCHAR(1500) NOT NULL,
    method_type VARCHAR(50) NOT NULL DEFAULT 'GET',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_goal_id) REFERENCES campaign_goals(id) ON DELETE SET NULL
);

-- Indexes for PostgreSQL
CREATE INDEX idx_affiliates_email ON affiliates(email);
CREATE INDEX idx_affiliates_approval_status ON affiliates(approval_status);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_goals_campaign_id ON campaign_goals(campaign_id);
CREATE INDEX idx_campaign_goals_tracking_code ON campaign_goals(tracking_code);
CREATE INDEX idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX idx_affiliate_links_campaign_id ON affiliate_links(campaign_id);
CREATE INDEX idx_affiliate_links_slug ON affiliate_links(slug);
CREATE INDEX idx_clicks_affiliate_id ON clicks(affiliate_id);
CREATE INDEX idx_clicks_click_code ON clicks(click_code);
CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX idx_conversions_affiliate_id ON conversions(affiliate_id);
CREATE INDEX idx_conversions_status ON conversions(status);
CREATE INDEX idx_conversions_converted_at ON conversions(converted_at);
CREATE INDEX idx_payouts_affiliate_id ON payouts(affiliate_id);
CREATE INDEX idx_payouts_status ON payouts(status);
```

### Drizzle Migration Example (PostgreSQL)

```typescript
import { sql } from 'drizzle-orm';
import { pgTable, serial, varchar, text, numeric, timestamp, bigint, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Create enums
export const approvalStatusEnum = pgEnum("approval_status", [
  "approved", "rejected", "suspended", "pending"
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "active", "paused", "ended"
]);

// Migration function
export async function up(db: any): Promise<void> {
  // Create affiliates table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS affiliates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      approval_status approval_status DEFAULT 'pending',
      paypal_address VARCHAR(255),
      bank_details JSONB,
      address JSONB,
      tax_id VARCHAR(255),
      is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      email_verified_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create campaigns table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      logo_url VARCHAR(255),
      campaign_type VARCHAR(255) NOT NULL,
      status campaign_status NOT NULL DEFAULT 'active',
      terms_and_conditions TEXT,
      min_payout_request NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_affiliates_approval_status ON affiliates(approval_status)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)`);
}

export async function down(db: any): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS campaigns CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS affiliates CASCADE`);
  await db.execute(sql`DROP TYPE IF EXISTS campaign_status CASCADE`);
  await db.execute(sql`DROP TYPE IF EXISTS approval_status CASCADE`);
}
```

### PostgreSQL Query Examples

**Get Affiliate Dashboard Stats**
```sql
-- Get affiliate performance metrics
SELECT 
    a.id,
    a.name,
    a.email,
    COUNT(DISTINCT al.id) as total_links,
    COUNT(DISTINCT c.id) as total_clicks,
    COUNT(DISTINCT conv.id) as total_conversions,
    COALESCE(SUM(conv.commission), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN conv.status = 'pending' THEN conv.commission ELSE 0 END), 0) as pending_earnings,
    COALESCE(SUM(CASE WHEN conv.status = 'paid' THEN conv.commission ELSE 0 END), 0) as paid_earnings,
    CASE 
        WHEN COUNT(DISTINCT c.id) > 0 
        THEN (COUNT(DISTINCT conv.id)::DECIMAL / COUNT(DISTINCT c.id) * 100)
        ELSE 0 
    END as conversion_rate
FROM affiliates a
LEFT JOIN affiliate_links al ON a.id = al.affiliate_id AND al.status = 'active'
LEFT JOIN clicks c ON a.id = c.affiliate_id AND c.clicked_at >= NOW() - INTERVAL '30 days'
LEFT JOIN conversions conv ON a.id = conv.affiliate_id AND conv.converted_at >= NOW() - INTERVAL '30 days'
WHERE a.id = $1
GROUP BY a.id, a.name, a.email;
```

**Get Top Performing Campaigns**
```sql
-- Get campaign performance for affiliate
SELECT 
    camp.id,
    camp.name,
    camp.campaign_type,
    COUNT(DISTINCT c.id) as total_clicks,
    COUNT(DISTINCT conv.id) as total_conversions,
    COALESCE(SUM(conv.commission), 0) as total_earnings,
    COALESCE(AVG(conv.conversion_value), 0) as avg_conversion_value,
    CASE 
        WHEN COUNT(DISTINCT c.id) > 0 
        THEN (COUNT(DISTINCT conv.id)::DECIMAL / COUNT(DISTINCT c.id) * 100)
        ELSE 0 
    END as conversion_rate
FROM campaigns camp
LEFT JOIN affiliate_links al ON camp.id = al.campaign_id AND al.affiliate_id = $1
LEFT JOIN clicks c ON al.id = c.affiliate_link_id AND c.clicked_at >= NOW() - INTERVAL '30 days'
LEFT JOIN conversions conv ON camp.id = conv.campaign_id AND conv.affiliate_id = $1 
    AND conv.converted_at >= NOW() - INTERVAL '30 days'
WHERE camp.status = 'active'
GROUP BY camp.id, camp.name, camp.campaign_type
HAVING COUNT(DISTINCT c.id) > 0
ORDER BY total_earnings DESC, conversion_rate DESC
LIMIT 10;
```

## Migration Patterns

### Laravel Migration Example
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_offer_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('click_id')->nullable()->constrained('user_offer_clicks')->nullOnDelete();
            $table->string('external_transaction_id')->nullable();
            $table->decimal('sale_amount', 10, 2);
            $table->decimal('commission_amount', 10, 2);
            $table->decimal('user_earning', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->json('conversion_data')->nullable();
            $table->timestamp('sale_date')->useCurrent();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['offer_id', 'sale_date']);
            $table->index('external_transaction_id');
            $table->index(['status', 'sale_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_offer_sales');
    }
};
```

### API Migration Example (Kysely)
```typescript
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_activities')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('activity_type', sql`enum('login', 'offer_click', 'sale', 'referral', 'bonus_claim')`, (col) => col.notNull())
    .addColumn('activity_data', 'json')
    .addColumn('points_earned', 'decimal(10,2)', (col) => col.defaultTo(0))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createIndex('idx_user_activities_user_id')
    .on('user_activities')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('idx_user_activities_type_date')
    .on('user_activities')
    .columns(['activity_type', 'created_at'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_activities').execute();
}
```

## Query Optimization Patterns

### Efficient Queries Examples

**Get User Dashboard Data**
```sql
-- Optimized query for user dashboard
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.balance,
    u.lifetime_earnings,
    COUNT(DISTINCT uos.id) as total_sales,
    COUNT(DISTINCT uoc.id) as total_clicks,
    COALESCE(SUM(CASE WHEN uos.status = 'approved' THEN uos.user_earning ELSE 0 END), 0) as approved_earnings,
    COALESCE(SUM(CASE WHEN uos.status = 'pending' THEN uos.user_earning ELSE 0 END), 0) as pending_earnings
FROM users u
LEFT JOIN user_offer_sales uos ON u.id = uos.user_id AND uos.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
LEFT JOIN user_offer_clicks uoc ON u.id = uoc.user_id AND uoc.clicked_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE u.id = ?
GROUP BY u.id;
```

**Get Top Performing Offers**
```sql
-- Get offers with performance metrics
SELECT 
    o.id,
    o.title,
    o.reward_value,
    o.reward_type,
    COUNT(DISTINCT uoc.id) as total_clicks,
    COUNT(DISTINCT uos.id) as total_conversions,
    COALESCE(AVG(uos.sale_amount), 0) as avg_sale_amount,
    COALESCE(SUM(uos.user_earning), 0) as total_earnings,
    CASE 
        WHEN COUNT(DISTINCT uoc.id) > 0 
        THEN (COUNT(DISTINCT uos.id) * 100.0 / COUNT(DISTINCT uoc.id))
        ELSE 0 
    END as conversion_rate
FROM offers o
LEFT JOIN user_offer_clicks uoc ON o.id = uoc.offer_id 
    AND uoc.clicked_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
LEFT JOIN user_offer_sales uos ON o.id = uos.offer_id 
    AND uos.sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND uos.status = 'approved'
WHERE o.status = 'active'
GROUP BY o.id
HAVING total_clicks > 10
ORDER BY conversion_rate DESC, total_clicks DESC
LIMIT 20;
```

## Database Seeding

### Laravel Seeder Example
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Network;
use App\Models\Offer;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Shopping', 'slug' => 'shopping', 'icon_url' => '/icons/shopping.svg'],
            ['name' => 'Travel', 'slug' => 'travel', 'icon_url' => '/icons/travel.svg'],
            ['name' => 'Finance', 'slug' => 'finance', 'icon_url' => '/icons/finance.svg'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'icon_url' => '/icons/gaming.svg'],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        $networks = [
            ['name' => 'Commission Junction', 'slug' => 'cj', 'commission_rate' => 15.00],
            ['name' => 'ShareASale', 'slug' => 'shareasale', 'commission_rate' => 12.00],
            ['name' => 'ClickBank', 'slug' => 'clickbank', 'commission_rate' => 20.00],
        ];

        foreach ($networks as $networkData) {
            Network::create($networkData);
        }

        // Create sample offers
        $shoppingCategory = Category::where('slug', 'shopping')->first();
        $cjNetwork = Network::where('slug', 'cj')->first();

        Offer::create([
            'network_id' => $cjNetwork->id,
            'category_id' => $shoppingCategory->id,
            'title' => 'Amazon - Up to 5% Cashback',
            'description' => 'Earn cashback on millions of products from Amazon',
            'reward_type' => 'percentage',
            'reward_value' => 5.00,
            'click_url' => 'https://amazon.com?ref=savebucks',
            'status' => 'active',
            'is_featured' => true,
        ]);
    }
}
```

## Performance Optimization

### Indexing Strategy
```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_user_sales_status_date ON user_offer_sales(user_id, status, sale_date);
CREATE INDEX idx_offers_category_status ON offers(category_id, status, is_featured);
CREATE INDEX idx_clicks_user_date ON user_offer_clicks(user_id, clicked_at);

-- Covering indexes for frequently accessed columns
CREATE INDEX idx_users_auth_covering ON users(email, status) INCLUDE (id, first_name, last_name);

-- Partial indexes for specific conditions
CREATE INDEX idx_active_offers ON offers(created_at) WHERE status = 'active';
CREATE INDEX idx_pending_sales ON user_offer_sales(created_at) WHERE status = 'pending';
```

### Query Optimization Tips
1. **Use EXPLAIN** to analyze query execution plans
2. **Avoid SELECT \*** - specify only needed columns
3. **Use appropriate JOIN types** based on data relationships
4. **Implement pagination** for large result sets
5. **Use database-level aggregations** instead of application-level
6. **Cache frequently accessed data** in Redis
7. **Use read replicas** for reporting queries

## Data Integrity & Constraints

### Foreign Key Constraints
```sql
-- Ensure referential integrity
ALTER TABLE user_offer_sales 
ADD CONSTRAINT fk_sales_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_offer_sales 
ADD CONSTRAINT fk_sales_offer 
FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;

-- Prevent deletion of categories with active offers
ALTER TABLE offers 
ADD CONSTRAINT fk_offers_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
```

### Check Constraints
```sql
-- Ensure positive values
ALTER TABLE user_offer_sales 
ADD CONSTRAINT chk_positive_amounts 
CHECK (sale_amount >= 0 AND commission_amount >= 0 AND user_earning >= 0);

-- Ensure valid percentages
ALTER TABLE offers 
ADD CONSTRAINT chk_valid_percentage 
CHECK (reward_type != 'percentage' OR (reward_value >= 0 AND reward_value <= 100));
```

## Backup & Recovery

### Backup Strategy
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="savebucks"

# Create full backup
mysqldump --single-transaction --routines --triggers \
  --user=$DB_USER --password=$DB_PASS \
  $DB_NAME > $BACKUP_DIR/full_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/full_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "full_backup_*.sql.gz" -mtime +7 -delete
```

### Point-in-Time Recovery
```bash
# Enable binary logging in MySQL config
log-bin=mysql-bin
binlog-format=ROW
expire_logs_days=7

# Recovery process
mysql -u root -p savebucks < full_backup_20240101_120000.sql
mysqlbinlog --start-datetime="2024-01-01 12:00:00" \
  --stop-datetime="2024-01-01 14:30:00" \
  mysql-bin.000001 | mysql -u root -p savebucks
```

## Monitoring & Maintenance

### Performance Monitoring Queries
```sql
-- Slow query identification
SELECT 
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    sql_text
FROM mysql.slow_log 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY query_time DESC
LIMIT 10;

-- Index usage analysis
SELECT 
    table_schema,
    table_name,
    index_name,
    cardinality,
    sub_part,
    packed,
    nullable,
    index_type
FROM information_schema.statistics 
WHERE table_schema = 'savebucks'
ORDER BY table_name, seq_in_index;
```

### Maintenance Tasks
```sql
-- Regular maintenance procedures
ANALYZE TABLE users, offers, user_offer_sales;
OPTIMIZE TABLE user_offer_clicks;

-- Clean up old data
DELETE FROM user_sessions WHERE expires_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM user_activities WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

## Best Practices

### DO:
- Use transactions for multi-table operations
- Implement proper indexing strategy
- Use foreign key constraints
- Implement soft deletes for critical data
- Use appropriate data types and sizes
- Normalize data to reduce redundancy
- Implement proper backup strategy
- Monitor query performance regularly
- Use connection pooling
- Implement proper error handling

### DON'T:
- Store sensitive data in plain text
- Use SELECT * in production queries
- Create indexes on every column
- Ignore foreign key constraints
- Use VARCHAR(255) for everything
- Store JSON data without validation
- Skip database migrations
- Ignore slow query logs
- Use root user for applications
- Skip regular maintenance tasks