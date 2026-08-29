CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  age INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  account_age_days INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hallmark_pages (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  followers_count INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'private',
  free_until TEXT NOT NULL,
  billing_plan TEXT NOT NULL DEFAULT 'free_trial',
  verified_business INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS content_metrics (
  id TEXT PRIMARY KEY,
  hallmark_page_id TEXT NOT NULL,
  watch_minutes_60d INTEGER NOT NULL DEFAULT 0,
  watch_minutes_30d INTEGER NOT NULL DEFAULT 0,
  post_engagement_30d INTEGER NOT NULL DEFAULT 0,
  returning_viewers_30d INTEGER NOT NULL DEFAULT 0,
  unique_views_30d INTEGER NOT NULL DEFAULT 0,
  active_videos INTEGER NOT NULL DEFAULT 0,
  consecutive_follower_days INTEGER NOT NULL DEFAULT 0,
  original_content_score REAL NOT NULL DEFAULT 100,
  policy_violations INTEGER NOT NULL DEFAULT 0,
  gift_purchase_eligible INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (hallmark_page_id) REFERENCES hallmark_pages(id)
);

CREATE TABLE IF NOT EXISTS monetization_applications (
  id TEXT PRIMARY KEY,
  hallmark_page_id TEXT NOT NULL,
  product_key TEXT NOT NULL,
  status TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  decision_notes TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (hallmark_page_id) REFERENCES hallmark_pages(id)
);

CREATE TABLE IF NOT EXISTS payout_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_last4 TEXT NOT NULL,
  currency TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS revenue_ledger (
  id TEXT PRIMARY KEY,
  hallmark_page_id TEXT NOT NULL,
  product_key TEXT NOT NULL,
  gross_amount REAL NOT NULL,
  platform_fee REAL NOT NULL,
  reserve_amount REAL NOT NULL,
  tax_amount REAL NOT NULL,
  net_amount REAL NOT NULL,
  settlement_status TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  FOREIGN KEY (hallmark_page_id) REFERENCES hallmark_pages(id)
);

CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY,
  hallmark_page_id TEXT NOT NULL,
  payout_account_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  scheduled_for TEXT NOT NULL,
  paid_at TEXT,
  hold_reason TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (hallmark_page_id) REFERENCES hallmark_pages(id),
  FOREIGN KEY (payout_account_id) REFERENCES payout_accounts(id)
);

CREATE TABLE IF NOT EXISTS business_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  review_status TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS affiliate_events (
  id TEXT PRIMARY KEY,
  hallmark_page_id TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  commission_amount REAL NOT NULL DEFAULT 0,
  attribution_window_days INTEGER NOT NULL DEFAULT 7,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (hallmark_page_id) REFERENCES hallmark_pages(id)
);

CREATE TABLE IF NOT EXISTS platform_config (
  id TEXT PRIMARY KEY,
  minimum_age INTEGER NOT NULL DEFAULT 22,
  minimum_payout_threshold REAL NOT NULL DEFAULT 100,
  hallmark_monthly_fee REAL NOT NULL DEFAULT 24.99,
  hallmark_yearly_fee REAL NOT NULL DEFAULT 249.99,
  revenue_share_percentage REAL NOT NULL DEFAULT 0.55,
  gifts_cash_value REAL NOT NULL DEFAULT 0.01,
  supported_countries_json TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  affiliate_bonus_percentage REAL NOT NULL DEFAULT 0.01,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS policy_acknowledgements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  policy_key TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  accepted_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
