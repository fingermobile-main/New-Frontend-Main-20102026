const logger = require('./utils/logger');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { identityDb } = require('./db');

// File paths
const MARKETPLACE_CSV = path.resolve(__dirname, '../../Assets/CSV Files/Marketplace Products.csv');
const Loansqr_CSV = path.resolve(__dirname, '../../Assets/CSV Files/Loansqr Products.csv');

async function ensureTables() {
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) DEFAULT 0.00,
      stock_quantity INTEGER DEFAULT 0,
      creator_id INTEGER,
      category VARCHAR(255),
      platform_type VARCHAR(50) DEFAULT 'marketplace',
      status VARCHAR(50) DEFAULT 'active',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS Loansqr_products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      interest_rate DECIMAL(5, 2) NOT NULL,
      max_amount DECIMAL(15, 2) NOT NULL,
      loan_term_days INTEGER NOT NULL,
      eligibility_criteria JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function importMarketplace() {
  logger.info('Importing Marketplace products...');

  const { rows } = await identityDb.query('SELECT id FROM users LIMIT 1');
  const creator_id = rows.length > 0 ? rows[0].id : 1;

  return new Promise((resolve, reject) => {
    const products = [];
    fs.createReadStream(MARKETPLACE_CSV)
      .pipe(csv())
      .on('data', (row) => {
        products.push([
          row.name,
          row.description,
          parseFloat(row.price),
          parseInt(row.stock_quantity, 10),
          creator_id,
          row.category,
          row.platform_type
        ]);
      })
      .on('end', async () => {
        try {
          for (const product of products) {
            await identityDb.query(`
              INSERT INTO products (name, description, price, stock_quantity, creator_id, category, platform_type)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, product);
          }
          logger.info(`Successfully imported ${products.length} marketplace products.`);
          resolve();
        } catch (error) {
          logger.error('Error importing marketplace products:', error);
          reject(error);
        }
      });
  });
}

async function importLoansqr() {
  logger.info('Importing Loansqr products...');

  return new Promise((resolve, reject) => {
    const products = [];
    fs.createReadStream(Loansqr_CSV)
      .pipe(csv())
      .on('data', (row) => {
        products.push([
          row.name,
          row.description,
          parseFloat(row.interest_rate),
          parseFloat(row.max_amount),
          parseInt(row.loan_term_days, 10),
          row.eligibility_criteria
        ]);
      })
      .on('end', async () => {
        try {
          for (const product of products) {
            await identityDb.query(`
              INSERT INTO Loansqr_products (name, description, interest_rate, max_amount, loan_term_days, eligibility_criteria)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, product);
          }
          logger.info(`Successfully imported ${products.length} Loansqr products.`);
          resolve();
        } catch (error) {
          logger.error('Error importing Loansqr products:', error);
          reject(error);
        }
      });
  });
}

async function run() {
  try {
    await ensureTables();
    await importMarketplace();
    await importLoansqr();
    logger.info('All imports completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
