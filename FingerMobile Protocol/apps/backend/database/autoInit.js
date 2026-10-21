const fs = require('fs');
const path = require('path');
const { identityDb } = require('../db/db');
const logger = require('../config/logger');

async function autoInitDatabase() {
  const dbDir = path.join(__dirname);
  logger.info('[autoInit] Starting robust SQL initialization (file-based retry loop)...');

  try {
    const files = fs.readdirSync(dbDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql'));

    // Sort so critical tables and schemas run first, then seeds
    sqlFiles.sort((a, b) => {
      if (a.includes('critical')) return -1;
      if (b.includes('critical')) return 1;
      if (a.includes('schema')) return -1;
      if (b.includes('schema')) return 1;
      return 0;
    });

    let pendingFiles = [...sqlFiles];
    let previousPendingCount = -1;
    let iteration = 1;

    while (pendingFiles.length > 0 && pendingFiles.length !== previousPendingCount) {
      previousPendingCount = pendingFiles.length;
      const nextPending = [];
      logger.info(`[autoInit] Iteration ${iteration}: Attempting ${pendingFiles.length} files...`);

      for (const file of pendingFiles) {
        const filePath = path.join(dbDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        try {
          await identityDb.query(sql);
        } catch (err) {
          // If already exists, we might consider the file partially successful or entirely ignorable
          if (err.message.includes('already exists') || err.message.includes('multiple primary keys')) {
            // Log but do not retry this file as it's structurally present
            logger.info(`[autoInit] File ${file} hit an 'already exists' error, assuming structure is present.`);
          } else {
            nextPending.push({ file, lastError: err.message });
          }
        }
      }

      // Extract just the filenames for the next loop
      pendingFiles = nextPending.map(p => p.file || p);
      iteration++;
    }

    if (pendingFiles.length > 0) {
      logger.error(`[autoInit] Could not execute ${pendingFiles.length} files due to persistent errors.`);
      for (let i = 0; i < Math.min(5, pendingFiles.length); i++) {
        logger.error(`[autoInit] Failed file ${pendingFiles[i]}`);
      }
    } else {
      logger.info('[autoInit] Database SQL initialization complete with all files successful or already existing.');
    }
  } catch (error) {
    logger.error('[autoInit] Error during database initialization:', error.message);
  }
}

module.exports = { autoInitDatabase };
