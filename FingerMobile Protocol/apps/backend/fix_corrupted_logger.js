const logger = require('./utils/logger');
const fs = require('fs');

const filesToFix = [
  'services/fic_payment_gateway_service.js',
  'services/fic_biometric_service.js'
];

filesToFix.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    logger.info(`⚠️  File not,
found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix corrupted logger.error statements with multi-line strings
  content = content.replace(/logger\.error\('❌[^\n]*\n/g, 'logger.error(\'Error occurred\', ');

  // Remove duplicate module.exports
  content = content.replace(/\nmodule\.exports = \w+;\nmodule\.exports = \w+;/g, '\nmodule.exports = FICPaymentGatewayService;');

  fs.writeFileSync(filePath, content, 'utf8');
  logger.info(`✅,
Fixed: ${filePath}`);
});

logger.info('\nDone fixing corrupted logger statements');
