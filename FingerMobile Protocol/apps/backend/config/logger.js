'use strict';

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(logColors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  })
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false
});

logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message || 'An error occurred',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

logger.logAPI = (req, res, responseTime) => {
  logger.http({
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });
};

logger.logRequest = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id || null,
      userAgent: req.get('User-Agent')
    });
  });
  next();
};

logger.logPayment = (data) => logger.info('Payment Transaction', data);
logger.logAuthentication = (data) => logger.info('Authentication Event', data);
logger.auditLogger = logger;
logger.default = logger;

// Morgan stream adapter — required for app.use(morgan('combined', { stream: logger.stream }))
logger.stream = {
  write: (message) => {
    logger.http((message || '').trim());
  }
};

['info', 'warn', 'error', 'debug', 'http', 'log'].forEach((method) => {
  if (!logger[method] || typeof logger[method] !== 'function') {
    logger[method] = console[method] || (() => {});
  }
});

module.exports = logger;

