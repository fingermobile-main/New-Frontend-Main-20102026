'use strict';

const logger = require('../config/logger');

const fallback = (...args) => {};
['info', 'warn', 'error', 'debug', 'http', 'log'].forEach((method) => {
  if (!logger[method] || typeof logger[method] !== 'function') {
    logger[method] = console[method] || fallback;
  }
});

module.exports = logger;

