const logger = require('./utils/logger');
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'database', 'stercs_editor_schema.sql'), 'utf8');
    await pool.query(sql);
    logger.info('Schema executed successfully.');
  } catch (error) {
    logger.error('Error executing schema:', error);
  } finally {
    await pool.end();
  }
}

run();
