/**
 * Database Migration Rollback Helper
 */
const { pool } = require('../db');

async function rollbackLastBatch() {
  console.log('🔄 Checking last migration batch for rollback...');
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT filename FROM migrations_log ORDER BY id DESC LIMIT 1');
    if (res.rows.length === 0) {
      console.log('ℹ️ No migrations found to rollback.');
      return;
    }
    const lastMigration = res.rows[0].filename;
    console.log(`⚠️ Last recorded migration: ${lastMigration}. Automated rollback requires corresponding down.sql file.`);
  } catch (err) {
    console.warn('Database rollback check skipped (DB offline):', err.message);
  } finally {
    if (client) client.release();
    pool.end().catch(() => {});
  }
}

if (require.main === module) {
  rollbackLastBatch();
}

module.exports = { rollbackLastBatch };
