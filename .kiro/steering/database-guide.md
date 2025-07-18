# Database Design & Migration Guide

## Database Architecture Overview

The SaveBucks platform uses MySQL as the primary database with a well-structured schema supporting users, offers, transactions, gamification, and content management. The database is shared between the Laravel admin panel and Fastify API server.

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