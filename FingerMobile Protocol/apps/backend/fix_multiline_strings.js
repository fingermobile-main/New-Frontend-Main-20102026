/* eslint-disable no-undef */
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Regex for double quoted strings: match " then any char that's not " or a backslash escaped char, then " const doubleQuoteRegex = /"([^"\\]|\\.)*"/g;
      content = content.replace(doubleQuoteRegex, (match) => {
        if (match.includes('\n')) {
          // replace newlines and multiple spaces with a single space
          return match.replace(/\r?\n\s*/g, ' ');
        }
        return match;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        logger.info('Fixed multiline string in', fullPath);
      }
    }
  }
}

fixFiles('./stercs-editor');
fixFiles('./controllers');
fixFiles('./services');
fixFiles('./routes');
