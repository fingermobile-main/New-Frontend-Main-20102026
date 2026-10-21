/* eslint-disable no-console, no-unused-vars */
const fs = require('fs');
const { pool } = require('./db');
const logger = require('./config/logger');

async function importForumCategories() {
  try {
    const sql = fs.readFileSync('./database/import_forum_categories_fixed.sql', 'utf8');

    logger.info('Importing forum categories...');
    const result = await pool.query(sql);
    logger.info('Successfully imported forum categories.');
  } catch (err) {
    logger.logError(err, { action: 'import_forum_categories' });
  } finally {
    await pool.end();
  }
}

importForumCategories();
