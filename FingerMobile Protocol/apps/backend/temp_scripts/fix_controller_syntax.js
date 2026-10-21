/* eslint-disable no-useless-escape */
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Function to fix syntax errors in a file
function fixSyntaxErrors(fileContent) {
  let fixedContent = fileContent;

  // Fix common syntax errors:
  // 1. Fix "{" pattern (extra comma after opening brace)
  fixedContent = fixedContent.replace(/\{\s*\,\s*\n/g, '{\n');

  // 2. Fix broken string literals and concatenation
  fixedContent = fixedContent.replace(/([^"\\])" \+/g, '$1" + '); fixedContent = fixedContent.replace(/\+ "([^"\\])\s*\n/g, '+ "$1\n');

  // 3. Fix missing commas in object properties
  fixedContent = fixedContent.replace(/(\w+)\s*:\s*\w+\s*\n\s*(\w+)\s*:/g, '$1: $2 $3:');

  // 4. Fix common broken patterns
  fixedContent = fixedContent.replace(/\/\/,\s*\n/g, '// ');

  return fixedContent;
}

// Process all controller files
const controllerDir = './controllers';
const files = fs.readdirSync(controllerDir);

logger.info('Fixing syntax errors in controller files...');
let fixedCount = 0;

files.filter(file => file.endsWith('.js')).forEach(file => {
  const filePath = path.join(controllerDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixSyntaxErrors(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      logger.info(`Fixed syntax errors in: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    logger.error(`Error processing ${file}:`, error.message);
  }
});

logger.info(`Successfully fixed ${fixedCount} controller files.`);
