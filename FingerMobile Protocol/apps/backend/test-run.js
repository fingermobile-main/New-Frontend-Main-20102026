const logger = require('./utils/logger');
require('ts-node').register();
const t = require('./test-export');
logger.info(t, typeof t.hello);
