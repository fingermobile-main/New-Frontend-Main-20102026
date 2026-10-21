const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

// Function to fix the specific syntax errors in controller files
function fixControllerSyntax(content) {
  let fixedContent = content;

  // Remove trailing '+' characters from lines
  fixedContent = fixedContent.replace(/\s*\+\s*$/gm, '');

  // Fix import statement to remove unused socialDb
  fixedContent = fixedContent.replace(
    /const \{ identityDb,\s*socialDb \} = require\("\.\.\/db"\);/g,
    'const { identityDb } = require("../db");'
  );

  // Replace the dynamic success message with the improved version
  fixedContent = fixedContent.replace(
    /message:\s*`User \$\{muteType\}ed successfully`/g,
    `const messages = {
    block: "User blocked successfully"     mute_notifications: "Notifications muted successfully"     mute_ugc: "UGC muted successfully"
};
message: messages[muteType] || "Operation completed successfully"`
  );

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
