/**
 * Seed Executive Accounts into fingermobile_main database
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_main',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

async function seedExecutives() {
  const client = await pool.connect();
  try {
    console.log('Seeding Executive Accounts into users table...');
    const defaultPasswordHash = await bcrypt.hash('Sovereign2026!Password', 10);

    const executives = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'fingermobileprotocol@gmail.com',
        username: 'fingermobileprotocol',
        displayName: 'FingerMobile Protocol HQ',
        role: 'primary admin'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'obinnambah100@gmail.com',
        username: 'israelobinna',
        displayName: 'Obinna Mbah (Founder & SuperAdmin)',
        role: 'superadmin'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'gracelinkbustech@gmail.com',
        username: 'gracelink_primary',
        displayName: 'Gracelink SuperAdmin',
        role: 'superadmin'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'eunicembah@gmail.com',
        username: 'eunicembah',
        displayName: 'Eunice Mbah (CFO & Co-Founder)',
        role: 'cfo'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'philipatiks@yahoo.com',
        username: 'philipatiks',
        displayName: 'Philip Atiks (CFO & Co-Founder)',
        role: 'cfo'
      }
    ];

    for (const exec of executives) {
      const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $2', [exec.email.toLowerCase(), exec.username.toLowerCase()]);
      if (existing.rows.length > 0) {
        await client.query(`
          UPDATE users
          SET display_name = $1, role = $2, is_active = TRUE, is_verified = TRUE, reputation_score = 1000, gem_balance = 50000, updated_at = NOW()
          WHERE id = $3
        `, [exec.displayName, exec.role, existing.rows[0].id]);
        console.log(`Updated executive user: ${exec.email}`);
      } else {
        await client.query(`
          INSERT INTO users (
            id, email, username, display_name, role, is_active, is_verified,
            email_verified, reputation_score, gem_balance, password_hash, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, TRUE, TRUE, TRUE, 1000, 50000, $6, NOW(), NOW())
        `, [exec.id, exec.email, exec.username, exec.displayName, exec.role, defaultPasswordHash]);
        console.log(`Inserted executive user: ${exec.email}`);
      }
    }

    console.log('✅ Successfully synced all 5 Executive accounts in fingermobile_main database.');
  } catch (err) {
    console.error('Error seeding executives:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedExecutives()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
