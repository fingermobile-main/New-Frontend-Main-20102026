const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console transport configuration
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
});

// Error log transport - rotates daily, keeps 30 days
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat
});

// Combined log transport - rotates daily, keeps 30 days
const combinedFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'info',
  format: logFormat
});

// Audit log transport for financial transactions - keeps 90 days
const auditFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'audit-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '90d',
  level: 'info',
  format: logFormat
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'fingermobile-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    consoleTransport,
    errorFileTransport,
    combinedFileTransport,
    auditFileTransport
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Create audit logger (separate instance for financial transactions)
export const auditLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: {
    service: 'fingermobile-audit',
    type: 'financial_transaction'
  },
  transports: [auditFileTransport]
});

// Helper functions for structured logging
export const logRequest = (req: any, res: any, next: any) => {
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

export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  });
};

export const logPayment = (data: any) => {
  auditLogger.info('Payment Transaction', {
    timestamp: new Date().toISOString(),
    ...data
  });
};

export const logAuthentication = (data: any) => {
  auditLogger.info('Authentication Event', {
    timestamp: new Date().toISOString(),
    eventType: 'auth',
    ...data
  });
};

// CommonJS & ES Module compatibility
module.exports = logger;
module.exports.default = logger;
module.exports.auditLogger = auditLogger;
module.exports.logRequest = logRequest;
module.exports.logError = logError;
module.exports.logPayment = logPayment;
module.exports.logAuthentication = logAuthentication;

export default logger;

