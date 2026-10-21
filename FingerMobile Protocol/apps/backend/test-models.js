const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');
const modelsPath = path.join(__dirname, 'models');

const files = fs.readdirSync(modelsPath);
logger.info(files.length + ' files found');

const tsModels = files.filter(f => f.endsWith('.ts'));
const jsModels = files.filter(f => f.endsWith('.js'));
logger.info('TS:', tsModels);
logger.info('JS:', jsModels);
