/**
 * Setup User Consent Tables in PostgreSQL
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Implements NDPA 2023 Section 31, GDPR Art. 6/9, and EU AI Act Art. 52
 */

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5433', 10),
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connecting to PostgreSQL on port', process.env.DB_PORT || '5433');

    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_user_consents (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) UNIQUE NOT NULL DEFAULT 'anonymous_user',
        consent_version INT DEFAULT 1,
        flags JSONB NOT NULL DEFAULT '{"essential": true, "functional": false, "analytics": false, "marketing": false, "ai_training": false}'::jsonb,
        has_consented BOOLEAN DEFAULT true,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_platform_user_consents_user ON platform_user_consents(user_id);

      CREATE TABLE IF NOT EXISTS platform_consent_audit_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        flags JSONB NOT NULL,
        legal_basis VARCHAR(150) NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_platform_consent_audit_user ON platform_consent_audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_platform_consent_audit_created ON platform_consent_audit_logs(created_at DESC);
    `);

    // Seed default anonymous user consent record
    await client.query(`
      INSERT INTO platform_user_consents (user_id, consent_version, flags, has_consented, ip_address, user_agent)
      VALUES (
        'anonymous_user',
        1,
        '{"essential": true, "functional": true, "analytics": true, "marketing": false, "ai_training": false}'::jsonb,
        true,
        '127.0.0.1',
        'Mozilla/5.0 (Platform Initializer)'
      )
      ON CONFLICT (user_id) DO NOTHING;
    `);

    console.log('✅ User consent and audit log tables successfully created and seeded!');
  } catch (err) {
    console.error('❌ Failed to setup user consent tables:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
