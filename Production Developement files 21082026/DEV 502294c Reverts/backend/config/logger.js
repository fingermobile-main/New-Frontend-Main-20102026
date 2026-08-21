const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels and colors
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

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss:ms'
  }),
  winston.format.errors({
    stack: true
  }),
  winston.format.splat(),
  winston.format.json()
);

// Console format with colors
const consoleFormat = winston.format.combine(
  winston.format.colorize({
    all: true
  }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Create transports
const transports = [
  // Console logging
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  }),

  // Error log file - rotates daily, keeps 30 days
  new DailyRotateFile({
    filename: path.join(__dirname, '../logs/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true, // Add this option to handle rotation better
    format: logFormat
  }),

  // Combined log file - rotates daily, keeps 14 days
  new DailyRotateFile({
    filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true, // Add this option to handle rotation better
    format: logFormat
  }),

  // HTTP request log file - rotates daily, keeps 7 days
  new DailyRotateFile({
    filename: path.join(__dirname, '../logs/http-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    maxSize: '20m',
    maxFiles: '7d',
    zippedArchive: true, // Add this option to handle rotation better
    format: logFormat
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false
});

// Create a stream object for Morgan integration
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Export logger and utility functions
module.exports = logger;

// Utility function for structured error logging
logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message || 'An error occurred',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Utility function for structured API logging
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