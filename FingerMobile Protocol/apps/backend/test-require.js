const logger = require('./utils/logger');
require('ts-node').register();
const g = require('./controllers/GradingSystemController');
logger.info(Object.keys(g));
logger.info(g.default);
