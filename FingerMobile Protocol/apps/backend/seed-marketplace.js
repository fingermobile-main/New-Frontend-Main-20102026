const logger = require('./utils/logger');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

async function seed() {
  try {
    const { rows: users } = await pool.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      logger.info('No users found to set as seller.');
      process.exit(1);
    }
    const sellerId = users[0].id;

    await pool.query(`
      INSERT INTO products (name, description, base_price, seller_id, status)
      VALUES 
        ('FingerMobile Premium Hat', 'A premium hat with FingerMobile logo.', 25.00, $1, 'active'),
        ('FingerMobile Dev Hoodie', 'Black hoodie for developers.', 55.00, $1, 'active'),
        ('FingerMobile NFT Collection #1', 'Exclusive digital collectable.', 100.00, $1, 'active')
      ON CONFLICT DO NOTHING;
    `, [sellerId]);

    logger.info('Successfully seeded products.');
    process.exit(0);
  } catch (err) {
    logger.error('Error seeding:', err);
    process.exit(1);
  }
}
seed();
