const logger = require('./utils/logger');
const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./eslint-report.json', 'utf8'));

report.forEach(fileReport => {
  fileReport.messages.forEach(msg => {
    const ruleId = msg.ruleId || 'syntax-error';
    if (ruleId === 'syntax-error') {
      logger.info(`Syntax Error in: ${fileReport.filePath}`);
    } else if (ruleId === 'no-undef') {
      logger.info(`Undefined variable in: ${fileReport.filePath} - ${msg.message}`);
    }
  });
});
