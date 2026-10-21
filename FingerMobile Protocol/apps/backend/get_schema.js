const logger = require('./utils/logger');
const { pool } = require('./db');
async function run() {
  const c = await pool.connect();
  const res = await c.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'forums\'');
  logger.info(res.rows);
  c.release();
  process.exit(0);
}
run();
