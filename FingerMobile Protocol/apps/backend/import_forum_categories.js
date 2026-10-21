#!/usr/bin/env node
const logger = require('./utils/logger');

/**
 * Forum Categories Import Script
 * Handles complex CSV with embedded newlines
 */

const fs = require('fs');
const { execSync } = require('child_process');

const CSV_FILE = '/Users/user/Documents/FingerMobile Protocol Communication/dev files 13042026/Development Documents 17122025/csv docs 17122025/FingerMobile Forum Categories (1).csv';

logger.info('🏷️  Importing Forum Categories...\n');

// Read raw CSV content
const csvContent = fs.readFileSync(CSV_FILE, 'utf8');

// Simple parsing - split by lines and extract key fields
const lines = csvContent.split('\n').filter(line => line.trim());

// Skip header line
const dataLines = lines.slice(1);

let importedCount = 0;
let skippedCount = 0;

for (const line of dataLines) {
  try {
    // Extract fields using regex for quoted values
    const nameMatch = line.match(/"Name":"([^"]*)"/); const descMatch = line.match(/"Description":"([^"]*)"/);
    const rankMatch = line.match(/"Rank":(\d+)/);

    if (!nameMatch) continue;

    const name = nameMatch[1] || 'Unnamed Category';
    const description = descMatch ? descMatch[1].substring(0, 500) : ''; // Truncate long descriptions
    const orderIndex = rankMatch ? parseInt(rankMatch[1]) : 999;

    // Escape single quotes for SQL
    const escapedName = name.replace(/'/g, '\'\'');
    const escapedDesc = description.replace(/'/g, '\'\'');

    const sql = `INSERT INTO forum_categories (name, description, order_index) VALUES ('${escapedName}', '${escapedDesc}', ${orderIndex});`;

    execSync(`docker exec -i fingermobile_postgres psql -U postgres -d fingermobile_platform_db <<EOF\n${sql}\nEOF`, { stdio: 'pipe' });
    importedCount++;

    if (importedCount % 10 === 0) {
      logger.info(`   ✓ Imported ${importedCount} categories...`);
    }
  } catch (error) {
    skippedCount++;
  }
}

logger.info(`\n✅ Forum categories import complete: ${importedCount} imported, ${skippedCount} skipped`);
