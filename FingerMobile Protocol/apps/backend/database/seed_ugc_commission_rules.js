const { pool } = require('../db');
const logger = require('../utils/logger');

async function seedRules() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create commission rules table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS commission_rules (
        id SERIAL PRIMARY KEY,
        commission_type VARCHAR(100) NOT NULL,
        platform_percentage DECIMAL(5,2) NOT NULL,
        creator_percentage DECIMAL(5,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(commission_type)
      )
    `);

    // Create commissions tracking table if not exists (referenced in CommissionService)
    await client.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(100),
        creator_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        platform_fee DECIMAL(10,2) NOT NULL,
        creator_commission DECIMAL(10,2) NOT NULL,
        commission_percentage DECIMAL(5,2) NOT NULL,
        commission_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP,
        payout_method VARCHAR(50)
      )
    `);

    // Create fic_transactions table if not exists (referenced in FICService)
    await client.query(`
      CREATE TABLE IF NOT EXISTS fic_transactions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert UGC rules
    await client.query(`
      INSERT INTO commission_rules (commission_type, platform_percentage, creator_percentage)
      VALUES 
        ('ugc_gift', 30.00, 70.00),
        ('ugc_gem', 20.00, 80.00),
        ('ugc_product', 10.00, 90.00),
        ('ugc_giftcard', 10.00, 90.00)
      ON CONFLICT (commission_type) 
      DO UPDATE SET 
        platform_percentage = EXCLUDED.platform_percentage,
        creator_percentage = EXCLUDED.creator_percentage
    `);

    await client.query('COMMIT');
    logger.info('UGC Commission rules seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error seeding commission rules:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedRules();
