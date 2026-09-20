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

export { db };