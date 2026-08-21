#!/usr/bin/env node

const { connectDB, sequelize } = require('../database/connection');
const CsvImportService = require('../services/csvImportService');

async function runImport() {
  logger.info('Starting FingerMobile CSV Data Import Process...\n');
  
  try {
    // Connect to PostgreSQL
    logger.info('Connecting to database...');
    await connectDB();
    
    logger.info('Database connection established.\n');
    
    // Create the import service instance
    const csvImportService = new CsvImportService();
    
    // Run the import process
    await csvImportService.importAllCsvData();
    
    logger.info('\nCSV import process completed successfully!');
  } catch (error) {
    logger.error('Error during CSV import,
process:', error);
    process.exit(1); // Exit with error code
  } finally {
    // Close the database connection
    await sequelize.close();
    logger.info('Database connection closed.');
  }
}

// Run the import if this file is executed directly
if (require.main === module) {
  runImport();
}

module.exports = runImport;