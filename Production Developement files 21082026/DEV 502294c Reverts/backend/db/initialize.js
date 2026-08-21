/**
 * Database Initialization Script
 * Creates all necessary tables if they don't exist
 */

const { identityDb, contentDb, financialDb, securityDb } = require('./db');
const bcrypt = require("bcryptjs");
const {
  v4: uuidv4 
} = require("uuid");
const logger = require('../config/logger'); // Added missing logger import

/**
 * Initialize database tables for Identity Management
 */
async function initializeIdentityTables() {
  // Create users table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      phone VARCHAR(20),
      date_of_birth DATE,
      gender VARCHAR(20),
      bio TEXT,
      avatar_url TEXT,
      cover_photo_url TEXT,
      location VARCHAR(255),
      timezone VARCHAR(50) DEFAULT 'UTC',
      language VARCHAR(10) DEFAULT 'en',
      role VARCHAR(20) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      is_verified BOOLEAN DEFAULT false,
      email_verified BOOLEAN DEFAULT false,
      phone_verified BOOLEAN DEFAULT false,
      two_factor_enabled BOOLEAN DEFAULT false,
      two_factor_secret VARCHAR(32),
      backup_codes JSONB,
      privacy_level VARCHAR(20) DEFAULT 'public',
      online_status VARCHAR(20) DEFAULT 'online',
      last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create user sessions table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true
    );
  `);

  // Create refresh tokens table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_revoked BOOLEAN DEFAULT false
    );
  `);

  // Create user friendships table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_friendships (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, friend_id)
    );
  `);

  // Create indexes for better performance
  await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_friendships_user_id ON user_friendships(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_friendships_friend_id ON user_friendships(friend_id);
  `);

  // Add role column if it doesn't exist (for existing installations)
  try {
    await identityDb.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `);
  } catch (error) {
    // Ignore if column already exists
  }

  // Add is_active column if it doesn't exist (for existing installations)
  try {
    await identityDb.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
  } catch (error) {
    // Ignore if column already exists
  }
}

/**
 * Initialize database tables for Monetization
 */
async function initializeMonetizationTables() {
  // FIC Wallet Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_wallets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      wallet_address VARCHAR(255) UNIQUE NOT NULL,
      balance DECIMAL(15, 2) DEFAULT 0.00,
      currency VARCHAR(10) DEFAULT 'FIC',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // FIC Transaction History Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_transactions (
      id SERIAL PRIMARY KEY,
      wallet_id INTEGER REFERENCES fic_wallets(id) ON DELETE CASCADE,
      amount DECIMAL(15, 2) NOT NULL,
      transaction_type VARCHAR(50) NOT NULL,
      description TEXT,
      from_account VARCHAR(255),
      to_account VARCHAR(255),
      transaction_status VARCHAR(50) DEFAULT 'completed',
      transaction_reference VARCHAR(255) UNIQUE,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Exchange Rate Tracking Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_exchange_rates (
      id SERIAL PRIMARY KEY,
      base_currency VARCHAR(10) DEFAULT 'FIC',
      target_currency VARCHAR(10) NOT NULL,
      rate DECIMAL(15, 6) NOT NULL,
      source VARCHAR(50),
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Monetization Events Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS monetization_events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      event_type VARCHAR(100) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'NGN',
      status VARCHAR(20) DEFAULT 'pending',
      reference VARCHAR(255),
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Indexes for Performance
  await monetizationDb.query(`
    CREATE INDEX IF NOT EXISTS idx_fic_wallets_user_id ON fic_wallets(user_id);
    CREATE INDEX IF NOT EXISTS idx_fic_wallets_address ON fic_wallets(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_fic_transactions_wallet_id ON fic_transactions(wallet_id);
    CREATE INDEX IF NOT EXISTS idx_fic_transactions_reference ON fic_transactions(transaction_reference);
    CREATE INDEX IF NOT EXISTS idx_fic_exchange_rates_pair ON fic_exchange_rates(base_currency, target_currency);
    CREATE INDEX IF NOT EXISTS idx_monetization_events_user_id ON monetization_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_monetization_events_type ON monetization_events(event_type);
  `);

  // Trigger for Updating Timestamps
  await monetizationDb.query(`
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_fic_wallets_updated_at ON fic_wallets;
    CREATE TRIGGER update_fic_wallets_updated_at 
        BEFORE UPDATE ON fic_wallets 
        FOR EACH ROW 
        EXECUTE FUNCTION update_modified_column();

    DROP TRIGGER IF EXISTS update_fic_exchange_rates_updated_at ON fic_exchange_rates;
    CREATE TRIGGER update_fic_exchange_rates_updated_at 
        BEFORE UPDATE ON fic_exchange_rates 
        FOR EACH ROW 
        EXECUTE FUNCTION update_modified_column();
  `);
}

/**
 * Initialize database tables for Security
 */
async function initializeSecurityTables() {
  try {
    logger.info("Initializing security database tables...");

    // Create audit_logs table
    await securityDb.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        action VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100),
        resource_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create sender_certificates table for sealed sender protocol
    await communicationDb.query(`
      CREATE TABLE IF NOT EXISTS sender_certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(255) NOT NULL,
        public_key TEXT NOT NULL,
        private_key_encrypted TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    // Create sealed_messages table for sealed sender protocol
    await communicationDb.query(`
      CREATE TABLE IF NOT EXISTS sealed_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(255) NOT NULL,
        recipient_id VARCHAR(255) NOT NULL,
        encrypted_content TEXT NOT NULL,
        sealed_key TEXT NOT NULL,
        iv TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info("✅ Security tables created");
  } catch (error) {
    logger.error("Error initializing security tables:", error.message);
    throw error;
  }
}

/**
 * Initialize content database tables
 */
async function initializeContentTables() {
  try {
    logger.info("Initializing content database tables...");

    // Create posts table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL,
        content TEXT,
        media_urls TEXT[],
        type VARCHAR(50) DEFAULT 'text',
        visibility VARCHAR(20) DEFAULT 'public',
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create comments table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id UUID NOT NULL,
        content TEXT NOT NULL,
        parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info("✅ Content tables created");
  } catch (error) {
    logger.error("Error initializing content tables:", error.message);
    throw error;
  }
}

/**
 * Initialize financial database tables
 */
async function initializeFinancialTables() {
  try {
    logger.info("Initializing financial database tables...");

    // Create wallets table
    await financialDb.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        balance DECIMAL(15, 2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create transactions table
    await financialDb.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        description TEXT,
        reference_id VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info("✅ Financial tables created");
  } catch (error) {
    logger.error("Error initializing financial tables:", error.message);
    throw error;
  }
}

/**
 * Initialize all database tables
 */
async function initializeDatabase() {
  try {
    logger.info("Starting database initialization...");

    // Initialize identity database tables
    await initializeIdentityTables();
    logger.info("✅ Identity database initialized");

    // Initialize content database tables
    await initializeContentTables();
    logger.info("✅ Content database initialized");

    // Initialize financial database tables
    await initializeFinancialTables();
    logger.info("✅ Financial database initialized");

    // Initialize security database tables
    await initializeSecurityTables();
    logger.info("✅ Security database initialized");

    logger.info("🎉 All database tables created successfully!");
  } catch (error) {
    logger.error("❌ Error during database initialization:", error);
    throw error;
  }
}

module.exports = { initializeDatabase };

// Run initialization if this script is called directly
if (require.main === module) {
  initializeDatabase();
}