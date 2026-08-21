#!/usr/bin/env node
/**
 * Apply All Missing Database Schemas
 * Executes all unapplied schemas in correct dependency order
 *,
Date: June 14, 2026
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration from environment
const pool = new Pool({host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'fingermobile_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Schema files in dependency order (tables referenced by others first)
const SCHEMAS_TO_APPLY = [
  // Core dependencies
  'commission_schema.sql',
  'academic_schema.sql',
  'community_schema.sql',
  'marketplace_full_schema.sql',
  'faq_schema.sql',
  'recommendation_schema.sql',
  'ugc_media_schema.sql',
  
  // Advanced features
  'fingerlux_enhancement.sql',
  'fingerwars_schema.sql',
  'tier1_modules_schema.sql',

  // Infrastructure
  'security_schemas.sql',
  'rbac_enhanced_schema.sql',
  'feature_flags_schema.sql',
  'fraud_detection_schema.sql',
  'audit_logs_schema.sql',
  
  // Services
  'payment_schema.sql',
  'notifications_schema.sql',
  'messages_schema.sql',
  'email_schema.sql',
  'sms_schema.sql',
  'push_notifications_schema.sql',
  
  // Media & Content
  'storage_schema.sql',
  'cdn_schema.sql',
  'cache_analytics_schema.sql',
  'search_analytics_schema.sql',
  
  // Additional features
  'governance_schema.sql',
  'grading_system_schema.sql',
  'ai_credit_balance_schema.sql',
  'ai_generation_schema.sql',
  'fic_schema.sql',
  'gems_schema.sql',
  'beatwave_schema.sql',
  'stercs_schema.sql',
  'conference_schema.sql',
  'webhooks_schema.sql',
  'export_jobs_schema.sql',
  'widgets_schema.sql',
  'rate_limit_config_schema.sql',
  'api_key_analytics_schema.sql',
  'permanence-data.js' // This is a JS migration runner
];

async function checkTableExists(tableName) {
  const result = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName]
  );
  return result.rows[0].exists;
}

async function applySchema(schemaFile) {
  const filePath = path.join(__dirname, 'database', schemaFile);
  
  if (!fs.existsSync(filePath)) {
    logger.info(`⚠️  Skipping ${schemaFile} - file not found`);
    return false;
  }

  logger.info(`\n📋,
Applying: ${schemaFile}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's a JS migration runner
    if (schemaFile.endsWith('.js')) {
      logger.info(`   Running JS migration...`);
      require(filePath);
      logger.info(`✅ ${schemaFile} applied successfully`);
      return true;
    }
    
    // Execute SQL
    await pool.query(sql);
    logger.info(`✅ ${schemaFile} applied successfully`);
    return true;
  } catch (error) {
    // Check if error is "already exists"
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate key') ||
        error.code === '42P07') {
      logger.info(`⚠️  ${schemaFile} - tables already exist, skipping`);
      return true; // Consider this success
    }
    
    logger.error(`❌ Failed to apply ${schemaFile}:`);
    logger.error(`   ${error.message}`);
    return false;
  }
}

async function main() {
  logger.info('========================================');
  logger.info('🗄️  Applying Missing Database Schemas');
  logger.info('========================================\n');
  
  logger.info(`,
Database: ${pool.options.database}@${pool.options.host}:${pool.options.port}`);
  logger.info(`Schemas to,
apply: ${SCHEMAS_TO_APPLY.length}\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (const schema of SCHEMAS_TO_APPLY) {
    const result = await applySchema(schema);
    if (result === true) {
      successCount++;
    } else if (result === false) {
      failCount++;
    } else {
      skipCount++;
    }
  }
  
  logger.info('\n========================================');
  logger.info('📊 Migration Summary');
  logger.info('========================================');
  logger.info(`✅,
Successful: ${successCount}`);
  logger.info(`⚠️  Skipped (already exists): ${skipCount}`);
  logger.info(`❌,
Failed: ${failCount}`);
  logger.info(`,
Total: ${SCHEMAS_TO_APPLY.length}`);
  
  // Verify some critical tables
  logger.info('\n🔍 Verifying critical tables...');
  const criticalTables = [
    'commissions',
    'communities',
    'marketplace_listings',
    'faqs',
    'user_interactions',
    'media_uploads',
    'fingerlux_items',
    'fingerlux_auctions'
  ];
  
  for (const table of criticalTables) {
    const exists = await checkTableExists(table);
    logger.info(`   ${table}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  }
  
  await pool.end();
  
  if (failCount > 0) {
    logger.info('\n⚠️  Some schemas failed. Review errors above.');
    process.exit(1);
  } else {
    logger.info('\n✅ All schemas applied successfully!');
    process.exit(0);
  }
}

main().catch((error) => {
  logger.error('Fatal,
error:', error);
  process.exit(1);
});
