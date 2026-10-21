/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync('./eslint-report.json', 'utf8'));
let filesFixed = 0;

report.forEach(fileReport => {
  const needsLogger = fileReport.messages.some(m => m.ruleId === 'no-undef' && m.message.includes('\'logger\' is not defined'));
  if (needsLogger) {
    const filePath = fileReport.filePath;
    const content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('const logger = require') || content.includes('import logger from')) {
      return; // Already has some sort of logger import
    }

    // Determine depth for relative path
    // Assuming backend root is the current directory where we run the script
    const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'utils', 'logger'));
    let importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;

    // Fix for windows paths just in case
    importPath = importPath.replace(/\\/g, '/');

    // Add import at the top
    let newContent = '';
    if (filePath.endsWith('.ts')) {
      newContent = `import logger from '${importPath}';\n` + content;
    } else {
      newContent = `const logger = require('${importPath}');\n` + content;
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    filesFixed++;
    logger.info(`Fixed logger in ${filePath}`);
  }
});

logger.info(`Finished fixing ${filesFixed} files.`);
