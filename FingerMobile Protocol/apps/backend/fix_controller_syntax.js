/* eslint-disable no-useless-escape */
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

// Function to fix common syntax errors in a file
function fixSyntaxErrors(fileContent) {
  let fixedContent = fileContent;

  // Fix broken object literals (common pattern: "{" instead of "{")
  fixedContent = fixedContent.replace(/\{\s*\n\s*,/g, '{\n  ');

  // Fix broken comments (common pattern: "//," instead of "// ")
  fixedContent = fixedContent.replace(/\/\/\,/g, '// ');

  // Fix double commas (common pattern: ",," instead of ",")
  fixedContent = fixedContent.replace(/,,/g, ',');

  // Fix missing commas in object properties
  fixedContent = fixedContent.replace(/(\w+)\s*\n\s*(\w+:\s*)/g, '$1 $2');

  // Fix broken string literals that span lines without proper concatenation
  fixedContent = fixedContent = fixedContent.replace(/([^+])\s*\n\s*([A-Za-z])/g, '$1 +\n  $2');

  return fixedContent;
}

// Process all controller files
const controllersDir = './controllers';
const controllerFiles = fs.readdirSync(controllersDir);

logger.info('Fixing syntax errors in controller files...');

let fixedCount = 0;
for (const file of controllerFiles) {
  if (file.endsWith('.js')) {
    const filePath = path.join(controllersDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixSyntaxErrors(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      logger.info(`Fixed syntax errors in: ${file}`);
      fixedCount++;
    }
  }
}

logger.info(`Completed! Fixed ${fixedCount} controller files.`);
