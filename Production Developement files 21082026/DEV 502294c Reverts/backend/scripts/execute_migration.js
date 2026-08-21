#!/usr/bin/env node

/**
 * Execute Database Migration for Missing Tables
 * Creates all 25+ tables referenced by models
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

console.log('🚀 Starting Database Migration...\n');

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fingermobile_identity_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

async function executeMigration() {
  const client = await pool.connect();
  
  try {
    console.log('✓ Connected to database\n');
    
    // Read SQL migration file
    const sqlPath = path.join(__dirname, '..', 'database', 'create_missing_tables.sql');  // Fixed path - go up one level to backend root
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration file not found: ${sqlPath}`);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`✓ Loaded migration script (${(sql.length / 1024).toFixed(2)} KB)\n`);
    
    // Begin transaction
    await client.query('BEGIN');
    console.log('✓ Transaction started\n');
    
    // Execute migration
    console.log('⚙️  Executing SQL statements...');
    await client.query(sql);
    console.log('✓ All SQL statements executed successfully\n');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...\n');
    const verificationQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'users', 'wallets', 'transactions', 'earnings',
        'ai_feature_config', 'ai_subscriptions', 'ai_usage_logs',
        'block_mutes', 'achievements', 'user_achievements',
        'advertisements', 'campaigns', 'analytics_events',
        'forums', 'topics', 'groups', 'leaderboard_entries',
        'conversations', 'payment_gateways', 'seads_initiatives',
        'support_tickets', 'ticket_messages', 'video_editor_sessions',
        'content_moderation_queue', 'csv_import_jobs'
      )
      ORDER BY table_name
    `;
    
    const result = await client.query(verificationQuery);
    
    console.log(`✅ Successfully created ${result.rows.length} tables:\n`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✓ Transaction committed\n');
    
    console.log('==========================================');
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY');
    console.log(`   Tables Created: ${result.rows.length}`);
    console.log('==========================================\n');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('\n❌ MIGRATION FAILED');
    console.error('Error:', error.message);
    console.error('Details:', error);
    console.error('\nTransaction rolled back - no changes made to database\n');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
executeMigration();
