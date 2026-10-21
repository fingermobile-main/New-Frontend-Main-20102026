#!/usr/bin/env node
/* eslint-disable no-unused-vars */

/**
 * CSV Data Import Script
 *
 * This script imports all CSV data files into the FingerMobile platform database.
 * It processes:
 * - Members/Users data
 * - Blog posts
 * - Forum categories
 * - Comments
 * - Blog categories and tags
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import logger after dotenv is configured
const logger = require('./utils/logger');
const CsvImportService = require('./services/csvImportService');

async function main() {
  logger.info('='.repeat(80));
  logger.info('FINGERMOBILE CSV DATA IMPORT');
  logger.info('='.repeat(80));
  logger.info('');

  try {
    // Initialize database connection
    const { sequelize } = require('./database/connection');

    // Test connection
    await sequelize.authenticate();
    logger.info('✅ Database connection successful');
    logger.info('');

    // Sync models (creates tables if they don't exist)
    logger.info('Syncing database models...');
    await sequelize.sync({ alter: true });
    logger.info('✅ Database models synced');
    logger.info('');

    // Start CSV import
    logger.info('-'.repeat(80));
    logger.info('Starting CSV Import Process');
    logger.info('-'.repeat(80));
    logger.info('');

    const csvService = new CsvImportService();

    // Import all CSV data
    const result = await csvService.importAllCsvData();

    logger.info('');
    logger.info('='.repeat(80));
    logger.info('CSV IMPORT COMPLETED SUCCESSFULLY');
    logger.info('='.repeat(80));
    logger.info('');
    logger.info('Summary:');
    logger.info('- All member data imported');
    logger.info('- All blog posts imported');
    logger.info('- All forum categories imported');
    logger.info('- All additional data processed');
    logger.info('');
    logger.info('Next steps:');
    logger.info('1. Verify data in database');
    logger.info('2. Check frontend displays imported content');
    logger.info('3. Review any skipped records in logs');
    logger.info('');

    // Close database connection
    await sequelize.close();
    logger.info('Database connection closed');

    process.exit(0);
  } catch (error) {
    logger.error('');
    logger.error('='.repeat(80));
    logger.error('❌ CSV IMPORT FAILED');
    logger.error('='.repeat(80));
    logger.error('');
    logger.error('Error:', error.message);
    logger.error('Stack:', error.stack);
    logger.error('');
    logger.error('Please check:');
    logger.error('1. Database is running and accessible');
    logger.error('2. CSV files exist in the expected location');
    logger.error('3. Environment variables are correctly configured');
    logger.error('');

    process.exit(1);
  }
}

// Run the script
main();
