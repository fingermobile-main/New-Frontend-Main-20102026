const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

async function runMigration() {
  console.log('[CreatorTierMigration] Reading creator_regional_tier_schema.sql...');
  const sqlPath = path.join(__dirname, 'creator_regional_tier_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    console.log('[CreatorTierMigration] Applying SQL...');
    await pool.query(sql);
    console.log('[CreatorTierMigration] Successfully created/verified tables and seeds:');
    console.log('- regional_creator_tier_rules');
    console.log('- creator_profiles');
    console.log('- creator_invite_tokens');
    console.log('- creator_waitlist');
    console.log('- admin_creator_audit_logs');
    console.log('- creator_registration_cohorts');
  } catch (error) {
    console.error('[CreatorTierMigration] Error running migration:', error.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
