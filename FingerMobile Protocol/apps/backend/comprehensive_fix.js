const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

// Function to fix all syntax errors in a file
function fixControllerSyntax(content) {
  let fixedContent = content;

  // Remove trailing '+' characters from lines
  fixedContent = fixedContent.replace(/\s*\+\s*$/gm, '');

  // Fix broken object literals where commas are missing
  fixedContent = fixedContent.replace(/(\w+)\s*\n\s*(\w+\s*:)/g, '$1 $2');

  // Fix import statement to remove unused socialDb
  fixedContent = fixedContent.replace(
    /const \{ identityDb,\s*socialDb(,\s*contentDb)? \} = require\("\.\.\/db"\);/g,
    'const { identityDb, contentDb } = require("../db");'
  );

  // Fix broken object property definitions
  fixedContent = fixedContent.replace(/(\w+)\s*:.*\n\s*(\w+\s*:)/g, '$1 $2');

  return fixedContent;
}

// Process all controller files
const controllerDir = './controllers';
const files = fs.readdirSync(controllerDir);

logger.info('Fixing syntax errors in controller files...');
let fixedCount = 0;

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(controllerDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixedContent = fixControllerSyntax(content);

      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        logger.info(`Fixed syntax errors in: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      logger.error(`Error processing ${file}:`, error.message);
    }
  }
});

logger.info(`Successfully fixed ${fixedCount} controller files.`);
