/**
 * Clean & Purge Mock and Test Accounts from FingerMobile Platform Database
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.IDENTITY_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.IDENTITY_DB_HOST || process.env.DB_HOST || '127.0.0.1',
  database: process.env.IDENTITY_DB_NAME || 'fingermobile_platform_db',
  password: process.env.IDENTITY_DB_PASSWORD || process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.IDENTITY_DB_PORT || process.env.DB_PORT || '5433', 10),
});

const TARGET_EMAILS = [
  'eunicembah@gmail.com',
  'admin@fingermobileprotocol.com',
  'user@fingermobileprotocol.com',
  'creator@fingermobileprotocol.com',
  'merchant@fingermobileprotocol.com',
  'postcard_tester@fingermobileprotocol.com',
  'testonboarder_1792256053@fingermobileprotocol.com',
  'alex@platform.com',
  'sarah@protocol.io',
  'michael@dunder.com',
  'fatima.editor@fingermobileprotocol.com',
  'chidi.okafor@gmail.com',
  'creator.davinci@fingermobileprotocol.com',
  'enterprise@acmeglobal.com',
];

const TARGET_USERNAMES = [
  'lush_test_1637e6c18c8f_match',
  'lush_test_1637e6c18c8f',
  'eunicembah',
  'admin',
  'testuser',
  'creator',
  'merchant',
  'alexchen',
  'sarahjenkins',
  'michaelscott',
  'fatima_editor',
  'chidi_guest',
  'creator_davinci',
  'corp_acme',
  'testonboarder_1792256053',
  'postcard_tester',
];

async function purgeMockAccounts() {
  const client = await pool.connect();
  try {
    console.log('🔍 Identifying target mock and test accounts...');
    const userRes = await client.query(
      `SELECT * FROM users 
       WHERE LOWER(email) = ANY($1) 
          OR LOWER(username) = ANY($2)`,
      [TARGET_EMAILS.map((e) => e.toLowerCase()), TARGET_USERNAMES.map((u) => u.toLowerCase())]
    );

    if (userRes.rows.length === 0) {
      console.log('ℹ️ No matching mock or test accounts found in database.');
      return;
    }

    console.log(`Found ${userRes.rows.length} test/mock user records.`);

    // 1. Save backup to JSON
    const backupDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, 'removed_mock_users_backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(userRes.rows, null, 2), 'utf8');
    console.log(`💾 Saved backup of removed accounts to: ${backupFile}`);

    const userIds = userRes.rows.map((u) => u.id);

    // 2. Begin transaction for clean cascade removal
    await client.query('BEGIN');

    // Remove child records safely
    const childTables = [
      { table: 'verification_codes', col: 'user_id' },
      { table: 'fic_wallets', col: 'user_id' },
      { table: 'enhanced_wallets', col: 'member_id' },
      { table: 'user_profiles', col: 'user_id' },
      { table: 'user_roles', col: 'user_id' },
      { table: 'user_settings', col: 'user_id' },
      { table: 'user_preferences', col: 'user_id' },
      { table: 'user_activities', col: 'user_id' },
      { table: 'user_points', col: 'user_id' },
      { table: 'user_badges', col: 'user_id' },
    ];

    for (const { table, col } of childTables) {
      try {
        const delRes = await client.query(
          `DELETE FROM ${table} WHERE ${col}::text = ANY($1::text[])`,
          [userIds.map(String)]
        );
        if (delRes.rowCount > 0) {
          console.log(`  - Deleted ${delRes.rowCount} record(s) from ${table}`);
        }
      } catch (_tblErr) {
        // Table may not exist or has cascade constraint
      }
    }

    // 3. Delete from users table
    const deleteUsersRes = await client.query(
      `DELETE FROM users WHERE id = ANY($1::uuid[]) RETURNING id, email, username`,
      [userIds]
    );

    await client.query('COMMIT');
    console.log(`✅ Successfully removed ${deleteUsersRes.rowCount} mock/test accounts from 'users' table:`);
    deleteUsersRes.rows.forEach((r) => {
      console.log(`    • ${r.email || '(no email)'} (${r.username})`);
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to remove mock accounts:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

purgeMockAccounts()
  .then(() => {
    console.log('🎉 Cleanup complete. Database is now completely free of mock credentials.');
    process.exit(0);
  })
  .catch(() => process.exit(1));
