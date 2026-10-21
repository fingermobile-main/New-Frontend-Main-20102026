const fs = require('fs');
const path = require('path');
const { monetizationDb } = require('./db');
const logger = require('../utils/logger');

async function importMarketplaceProducts() {
  const csvPath = path.join(__dirname, 'marketplace_products_batch_1.csv');

  if (!fs.existsSync(csvPath)) {
    logger.error('CSV file not found');
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  const dataLines = lines.slice(1);

  let successCount = 0;

  for (const line of dataLines) {
    // Basic CSV parsing for strings enclosed in quotes
    const regex = /"([^"]*)"/g;
    const values = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      values.push(match[1]);
    }

    if (values.length === headers.length) {
      const [sku, name, description, price, stock, category, seller_id] = values;

      try {
        await monetizationDb.query(`
          INSERT INTO products (sku, name, description, price, stock, category, seller_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [sku, name, description, price, parseInt(stock), category, seller_id]);

        successCount++;
      } catch (err) {
        logger.error(`Error importing product ${sku}:`, err);
      }
    }
  }

  logger.info(`Successfully imported ${successCount} products from CSV batch.`);
  process.exit(0);
}

importMarketplaceProducts();
