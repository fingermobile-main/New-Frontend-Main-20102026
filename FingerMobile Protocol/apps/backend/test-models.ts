const logger = require('./utils/logger');
import fs from 'fs';
import path from 'path';

const modelsPath = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsPath);

async function testImports() {
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      try {
        const mod = await import(path.join(modelsPath, file));
        logger.info(`Successfully imported ${file}`);
        // logger.info(Object.keys(mod));
      } catch (e: any) {
        logger.info(`Failed to import ${file}: ${e.message}`);
      }
    }
  }
}

testImports();
