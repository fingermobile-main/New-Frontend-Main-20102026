"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = require("better-sqlite3");
const dbPath = process.env.DB_PATH || './database.sqlite';
exports.db = new better_sqlite3_1.default(dbPath);
// Initialize database tables
exports.db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    age INTEGER,
    country_code TEXT,
    account_age_days INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS seshat_pages (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    followers_count INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'public',
    free_until DATETIME,
    billing_plan TEXT DEFAULT 'free',
    verified_business BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS monetization_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    followers INTEGER DEFAULT 0,
    watch_minutes_60d INTEGER DEFAULT 0,
    watch_minutes_30d INTEGER DEFAULT 0,
    post_engagement_30d INTEGER DEFAULT 0,
    returning_viewers_30d INTEGER DEFAULT 0,
    unique_views_30d INTEGER DEFAULT 0,
    active_videos INTEGER DEFAULT 0,
    consecutive_follower_days INTEGER DEFAULT 0,
    account_age_days INTEGER DEFAULT 0,
    age INTEGER,
    is_eligible_country BOOLEAN DEFAULT FALSE,
    original_content_score REAL DEFAULT 0.0,
    policy_violations INTEGER DEFAULT 0,
    gift_purchase_eligible BOOLEAN DEFAULT FALSE,
    verified_business BOOLEAN DEFAULT FALSE,
    verified_payout BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS platform_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    minimum_age INTEGER DEFAULT 18,
    minimum_payout_threshold REAL DEFAULT 10.00,
    seshat_monthly_fee REAL DEFAULT 5.00,
    seshat_yearly_fee REAL DEFAULT 50.00,
    revenue_share_percentage REAL DEFAULT 50.00,
    gifts_cash_value REAL DEFAULT 0.05,
    affiliate_bonus_percentage REAL DEFAULT 5.00,
    supported_countries TEXT DEFAULT 'US,CA,GB,AU',
    policy_version TEXT DEFAULT '1.0'
  );

  CREATE TABLE IF NOT EXISTS monetization_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_key TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    decision_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    available_balance REAL DEFAULT 0.00,
    pending_payouts REAL DEFAULT 0.00,
    month_revenue REAL DEFAULT 0.00,
    threshold_remaining REAL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS estimates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    qualifying_views INTEGER DEFAULT 0,
    rpm REAL DEFAULT 0.0,
    impressions INTEGER DEFAULT 0,
    cpm REAL DEFAULT 0.0,
    gross_ad_revenue REAL DEFAULT 0.0,
    revenue_share_percentage REAL DEFAULT 50.0,
    total_clicks INTEGER DEFAULT 0,
    cpc REAL DEFAULT 0.0,
    total_revenue_generated REAL DEFAULT 0.0,
    total_orders INTEGER DEFAULT 0,
    total_production_costs REAL DEFAULT 0.0,
    product_link_clicks INTEGER DEFAULT 0,
    content_purchases INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_watch_time_minutes INTEGER DEFAULT 0,
    total_video_length_minutes INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    total_earnings REAL DEFAULT 0.0,
    total_ad_cost REAL DEFAULT 0.0,
    creator_revenue_share REAL DEFAULT 0.0,
    cpc_revenue REAL DEFAULT 0.0,
    ctr REAL DEFAULT 0.0,
    average_order_value REAL DEFAULT 0.0,
    roi REAL DEFAULT 0.0,
    click_to_view_ratio REAL DEFAULT 0.0,
    sales_conversion_rate REAL DEFAULT 0.0,
    view_to_purchase_rate REAL DEFAULT 0.0,
    average_view_duration REAL DEFAULT 0.0,
    retention_rate REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS affiliates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    total_earnings REAL DEFAULT 0.00,
    active_referrals INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0.0,
    commission_rate REAL DEFAULT 5.00,
    referral_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS affiliate_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    affiliate_id INTEGER NOT NULL,
    date DATE NOT NULL,
    referral TEXT NOT NULL,
    action TEXT NOT NULL,
    commission REAL DEFAULT 0.00,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS seshats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    active_subscribers INTEGER DEFAULT 0,
    monthly_revenue REAL DEFAULT 0.00,
    conversion_rate REAL DEFAULT 0.0,
    avg_retention INTEGER DEFAULT 0,
    basic_tier_price REAL DEFAULT 5.99,
    premium_tier_price REAL DEFAULT 11.99,
    enterprise_tier_price REAL DEFAULT 24.99,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    legal_name TEXT,
    registration_number TEXT,
    country_code TEXT,
    business_verified BOOLEAN DEFAULT FALSE,
    documents_submitted BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'pending',
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payout_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_last4 TEXT NOT NULL,
    currency TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS content_metrics (
    id TEXT PRIMARY KEY,
    seshat_page_id TEXT NOT NULL,
    watch_minutes_60d INTEGER DEFAULT 0,
    watch_minutes_30d INTEGER DEFAULT 0,
    post_engagement_30d INTEGER DEFAULT 0,
    returning_viewers_30d INTEGER DEFAULT 0,
    unique_views_30d INTEGER DEFAULT 0,
    active_videos INTEGER DEFAULT 0,
    consecutive_follower_days INTEGER DEFAULT 0,
    original_content_score REAL DEFAULT 0.0,
    policy_violations INTEGER DEFAULT 0,
    gift_purchase_eligible BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seshat_page_id) REFERENCES seshat_pages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS business_verifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    legal_name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    country_code TEXT NOT NULL,
    review_status TEXT DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS revenue_ledger (
    id TEXT PRIMARY KEY,
    seshat_page_id TEXT NOT NULL,
    product_key TEXT NOT NULL,
    gross_amount REAL DEFAULT 0.0,
    platform_fee REAL DEFAULT 0.0,
    reserve_amount REAL DEFAULT 0.0,
    tax_amount REAL DEFAULT 0.0,
    net_amount REAL DEFAULT 0.0,
    settlement_status TEXT DEFAULT 'pending',
    occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seshat_page_id) REFERENCES seshat_pages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payouts (
    id TEXT PRIMARY KEY,
    seshat_page_id TEXT NOT NULL,
    payout_account_id TEXT NOT NULL,
    amount REAL DEFAULT 0.0,
    status TEXT DEFAULT 'pending',
    scheduled_for DATETIME,
    paid_at DATETIME,
    hold_reason TEXT,
    FOREIGN KEY (seshat_page_id) REFERENCES seshat_pages(id) ON DELETE CASCADE,
    FOREIGN KEY (payout_account_id) REFERENCES payout_accounts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS affiliate_events (
    id TEXT PRIMARY KEY,
    seshat_page_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    commission_amount REAL DEFAULT 0.0,
    attribution_window_days INTEGER DEFAULT 30,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seshat_page_id) REFERENCES seshat_pages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    status TEXT DEFAULT 'received',
    received_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default config if not exists
  INSERT OR IGNORE INTO platform_config DEFAULT VALUES;
`);
exports.default = exports.db;
