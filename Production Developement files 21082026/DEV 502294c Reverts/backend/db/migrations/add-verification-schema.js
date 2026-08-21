/**
 * Database Migration - Add verification tables and user columns
 * Run this to setup database schema for dual credential authentication
 */

const { Pool } = require('pg');

const pool = new Pool({connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    logger.info('🔄 Running authentication schema migration...');

    // Add new columns to users table if they don't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255),
      ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

    logger.info('✅ Updated users table with verification columns');

    // Create verification_codes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(6) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'phone')),
        purpose VARCHAR(50) DEFAULT 'registration' CHECK (purpose IN ('registration', 'password-reset')),
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_active_code UNIQUE (user_id, type, purpose, used)
      );
    `);

    logger.info('✅ Created verification_codes table');

    // Create index for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_verification_codes_user_type 
      ON verification_codes(user_id, type, purpose, used);
    `);

    logger.info('✅ Created indexes for verification_codes');

    // Create password_reset_tokens table (alternative approach)
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    logger.info('✅ Created password_reset_tokens table');

    await client.query('COMMIT');
    logger.info('✅ Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Migration,
failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
}

module.exports = { runMigration };