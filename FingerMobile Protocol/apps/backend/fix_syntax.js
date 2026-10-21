/* eslint-disable no-unused-vars */
const logger = require('./utils/logger');
const fs = require('fs');
const glob = require('glob'); // use fs directly

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let lines = content.split('\n');
      let changed = false;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('message: "') && !lines[i].includes('",') && !lines[i].match(/"$/)) { // It has an unclosed quote. lines[i] = lines[i] + '",';
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        logger.info('Fixed syntax in', fullPath);
      }
    }
  }
}

fixFiles('./stercs-editor');
