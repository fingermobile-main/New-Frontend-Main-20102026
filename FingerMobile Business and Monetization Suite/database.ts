// Simple database connection mock
import sqlite3 from 'better-sqlite3';

// Create or connect to SQLite database
const db = new sqlite3('fingermobile.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    age INTEGER,
    account_age_days INTEGER DEFAULT 0,
    country_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS seshat_pages (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT CHECK(visibility IN ('public', 'private', 'unlisted')) DEFAULT 'public',
    followers_count INTEGER DEFAULT 0,
    verified_business BOOLEAN DEFAULT FALSE,
    free_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS content_metrics (
    id TEXT PRIMARY KEY,
    watch_minutes_60d REAL DEFAULT 0,
    watch_minutes_30d REAL DEFAULT 0,
    post_engagement_30d REAL DEFAULT 0,
    returning_viewers_30d REAL DEFAULT 0,
    unique_views_30d INTEGER DEFAULT 0,
    active_videos INTEGER DEFAULT 0,
    consecutive_follower_days INTEGER DEFAULT 0,
    original_content_score REAL DEFAULT 0,
    policy_violations INTEGER DEFAULT 0,
    gift_purchase_eligible BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS kyc_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    full_legal_name TEXT NOT NULL,
    date_of_birth TEXT,
    nationality TEXT,
    id_document_type TEXT,
    id_document_number TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country_code TEXT,
    biometric_hash TEXT,
    is_above_22_years BOOLEAN DEFAULT FALSE,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW')) DEFAULT 'PENDING',
    reviewed_by TEXT,
    review_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS kyb_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    business_legal_name TEXT NOT NULL,
    business_registration_number TEXT,
    business_type TEXT,
    tax_id TEXT,
    incorporation_date TEXT,
    registered_address TEXT,
    business_email TEXT,
    business_phone TEXT,
    website_url TEXT,
    industry_category TEXT,
    annual_revenue_range TEXT,
    employee_count_range TEXT,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW')) DEFAULT 'PENDING',
    reviewed_by TEXT,
    review_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS access_keys (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    type TEXT DEFAULT 'access_key',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    type TEXT DEFAULT 'coupon',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS platform_config (
    id TEXT PRIMARY KEY,
    minimum_age INTEGER DEFAULT 18,
    minimum_payout_threshold REAL DEFAULT 100,
    seshat_monthly_fee REAL DEFAULT 9.99,
    seshat_yearly_fee REAL DEFAULT 99.99,
    monetization_fee_percentage REAL DEFAULT 5,
    verification_fee REAL DEFAULT 50,
    payout_processing_time INTEGER DEFAULT 3,
    affiliate_commission_rate REAL DEFAULT 10,
    enable_monetization BOOLEAN DEFAULT 1,
    enable_affiliate_program BOOLEAN DEFAULT 1,
    content_policy TEXT,
    privacy_policy TEXT,
    terms_of_service TEXT,
    minimum_user_base INTEGER,
    revenue_share_percentage REAL DEFAULT 70,
    basic_eligibility_json TEXT,
    premium_eligibility_json TEXT,
    enterprise_eligibility_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS monetization_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    website TEXT,
    business_description TEXT,
    monthly_revenue REAL,
    country TEXT,
    product_interest_json TEXT,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'under_review')) DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewer_notes TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS business_verifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    registration_number TEXT,
    tax_id TEXT,
    incorporation_date TEXT,
    business_address TEXT,
    supporting_documents_json TEXT,
    verification_status TEXT CHECK(verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    verified_at DATETIME,
    notes TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS payout_accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    routing_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    bank_country TEXT NOT NULL,
    currency TEXT NOT NULL,
    verification_status TEXT CHECK(verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    summary TEXT,
    features_json TEXT,
    requirements_json TEXT,
    monthly_price REAL,
    yearly_price REAL,
    eligibility_requirements_json TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS affiliate_events (
    id TEXT PRIMARY KEY,
    affiliate_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    event_type TEXT CHECK(event_type IN ('click', 'signup', 'purchase', 'conversion')),
    commission_amount REAL,
    currency TEXT,
    metadata_json TEXT,
    occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS affiliate_metrics (
    id TEXT PRIMARY KEY,
    total_referrals INTEGER DEFAULT 0,
    total_commission REAL DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    average_commission_per_referral REAL DEFAULT 0,
    top_performing_referrals_json TEXT,
    monthly_trends_json TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS affiliates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    affiliate_id TEXT NOT NULL,
    commission_rate REAL DEFAULT 10,
    total_commission REAL DEFAULT 0,
    status TEXT CHECK(status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links_json TEXT,
    role TEXT CHECK(role IN ('user', 'moderator', 'admin', 'super_admin')) DEFAULT 'user',
    status TEXT CHECK(status IN ('active', 'inactive', 'suspended', 'deleted')) DEFAULT 'active',
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    user_agent TEXT,
    ip TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    content_type TEXT CHECK(content_type IN ('text', 'image', 'video', 'link', 'poll')) DEFAULT 'text',
    tags_json TEXT,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id TEXT,
    likes INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    parent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS seshat_pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    tags_json TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS content_metrics (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    engagement_rate REAL DEFAULT 0,
    reach INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    content TEXT NOT NULL,
    subject TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    participants_json TEXT NOT NULL,
    subject TEXT NOT NULL,
    last_message TEXT NOT NULL,
    last_message_at DATETIME NOT NULL,
    unread_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    message TEXT NOT NULL,
    title TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL,
    billing_cycle TEXT CHECK(billing_cycle IN ('monthly', 'yearly')),
    features_json TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('active', 'cancelled', 'expired', 'past_due')) DEFAULT 'active',
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    auto_renew BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    type TEXT CHECK(type IN ('subscription', 'one_time', 'payout', 'fee')),
    status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    provider TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'void')) DEFAULT 'draft',
    issued_at DATETIME NOT NULL,
    due_at DATETIME NOT NULL,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS revenue_ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_type TEXT CHECK(transaction_type IN ('sale', 'affiliate_commission', 'subscription_fee', 'refund')),
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    description TEXT NOT NULL,
    related_entity_id TEXT,
    related_entity_type TEXT,
    status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    metadata_json TEXT,
    processed_at DATETIME NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    discount_type TEXT CHECK(discount_type IN ('percentage', 'fixed_amount')),
    discount_value REAL NOT NULL,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,
    referee_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
    reward_amount REAL NOT NULL,
    reward_currency TEXT NOT NULL,
    rewarded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('achievement', 'referral', 'bonus', 'loyalty')),
    description TEXT NOT NULL,
    points INTEGER NOT NULL,
    value REAL,
    status TEXT CHECK(status IN ('pending', 'awarded', 'redeemed')) DEFAULT 'pending',
    awarded_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS analytics_data (
    id TEXT PRIMARY KEY,
    data_type TEXT CHECK(data_type IN ('user_engagement', 'content_performance', 'revenue_metrics', 'growth_metrics')),
    data_json TEXT NOT NULL,
    period_start DATETIME NOT NULL,
    period_end DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_data (
    id TEXT PRIMARY KEY,
    overview_json TEXT NOT NULL,
    recent_activity_json TEXT NOT NULL,
    system_stats_json TEXT NOT NULL,
    performance_metrics_json TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    reported_id TEXT NOT NULL,
    reported_type TEXT CHECK(reported_type IN ('user', 'post', 'comment', 'message')),
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
    reviewed_by TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS moderation_actions (
    id TEXT PRIMARY KEY,
    moderator_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT CHECK(target_type IN ('user', 'post', 'comment', 'message')),
    action TEXT CHECK(action IN ('warn', 'suspend', 'ban', 'remove_content', 'approve_content')),
    reason TEXT NOT NULL,
    duration INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT,
    target_type TEXT,
    metadata_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS product_keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT CHECK(visibility IN ('public', 'private', 'unlisted')) DEFAULT 'public',
    billing_plan TEXT CHECK(billing_plan IN ('basic', 'premium', 'enterprise', 'free_trial'))
  )
`);

export { db };