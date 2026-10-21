const logger = require('./utils/logger');
/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('./dist/database/connection'); // Using compiled DB config

async function runSeed() {
  logger.info('🌱 Starting Database Seeding Process...');

  try {
    // 1. Authenticate with the database
    await sequelize.authenticate();
    logger.info('✅ Connected to PostgreSQL successfully.');

    // 2. Read the seed file
    const seedFilePath = path.join(__dirname, 'database', 'seed_test_users.sql');
    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`Seed file not found at ${seedFilePath}`);
    }

    logger.info(`📄 Reading seed file: ${seedFilePath}`);
    const seedSql = fs.readFileSync(seedFilePath, 'utf8');

    // 3. Execute the SQL
    logger.info('⏳ Executing seed script (this may take a few seconds)...');
    await sequelize.query(seedSql);
    logger.info('🎉 Users table populated successfully!');
  } catch (error) {
    logger.error('❌ Failed to seed database:', error.message);
    if (error.name === 'SequelizeConnectionRefusedError') {
      logger.error('\n⚠️  ACTION REQUIRED: Your PostgreSQL server is not running or rejecting connections.');
      logger.error('   Please ensure Docker/Postgres is running locally before executing this script.');
    }
  } finally {
    // Always close the connection
    await sequelize.close();
    process.exit();
  }
}

runSeed();
