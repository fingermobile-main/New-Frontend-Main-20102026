const logger = require('./utils/logger');
logger.info('starting');
try {
  require('./models/index.ts');
  logger.info('loaded models');
} catch (e) {
  logger.info('error:', e);
}
