/**
 * create-and-seed-giftcards.js
 * Creates gift_cards table and seeds active gift cards.
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(100) UNIQUE NOT NULL,
        amount NUMERIC(15,2) NOT NULL DEFAULT 0,
        balance NUMERIC(15,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        currency VARCHAR(10) DEFAULT 'FIC',
        expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
        redeemed_at TIMESTAMP WITH TIME ZONE,
        purchased_by UUID,
        redeemed_by UUID,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Fetch user ID
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const userId = userRes.rows[0]?.id || '00000000-0000-0000-0000-000000000000';

    const countRes = await client.query('SELECT COUNT(*) FROM gift_cards');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      const cards = [
        { code: 'FMC-VIP-2026-X1', amount: 100, balance: 100, currency: 'FIC', description: 'FingerMobile VIP Creator Welcome Gift Card' },
        { code: 'FMC-LUSH-500-A2', amount: 500, balance: 500, currency: 'FIC', description: 'LushPressies & SuperVi Sovereign Grant Card' },
        { code: 'FMC-BEATWAVE-25', amount: 25, balance: 25, currency: 'FIC', description: 'BeatwaveNG Audio Producer & Stems Starter Voucher' }
      ];

      for (const c of cards) {
        await client.query(`
          INSERT INTO gift_cards (code, amount, balance, status, currency, purchased_by, description)
          VALUES ($1, $2, $3, 'active', $4, $5, $6)
          ON CONFLICT (code) DO NOTHING;
        `, [c.code, c.amount, c.balance, c.currency, userId, c.description]);
      }
      console.log('✅ Seeded active gift cards');
    }

    await client.query('COMMIT');
    console.log('✅ gift_cards table created & verified successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed creating gift_cards table:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
