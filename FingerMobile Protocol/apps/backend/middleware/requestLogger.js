/* eslint-disable no-unused-vars */
/**
 * RequestLoggerMiddleware
 * Comprehensive request/response logging with performance tracking
 */

const morgan = require('morgan');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {
    recursive: true });
}

// Create write streams for different log levels
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  {
    flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logDir, 'error.log'),
  {
    flags: 'a' }
);

const performanceLogStream = fs.createWriteStream(
  path.join(logDir, 'performance.log'),
  {
    flags: 'a' }
);

// Custom Morgan format for detailed logging
const detailedFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || generateRequestId();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  req.requestId = requestId;

  // Log request start
  logger.info(`[${requestId}] ${req.method} ${req.originalUrl} from ${req.ip}`);

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    };

    // Write to performance log
    performanceLogStream.write(JSON.stringify(logEntry) + '\n');

    // Log slow requests
    if (duration > 1000) {
      logger.warn(`[${requestId}] SLOW REQUEST: ${duration}ms - ${req.method} ${req.originalUrl}`);
    }
  });

  next();
};

// Error logger middleware
const errorLogger = (err, req, res, next) => {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
    userId: req.user?.id || 'anonymous',
    ip: req.ip
  };

  errorLogStream.write(JSON.stringify(errorEntry) + '\n');
  logger.error(`[ERROR] ${req.requestId}: ${err.message}`);

  next(err);
};

// Helper function to generate unique request IDs
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

requestLogger.requestLogger = requestLogger;
requestLogger.errorLogger = errorLogger;
requestLogger.detailedFormat = detailedFormat;
requestLogger.accessLogStream = accessLogStream;
requestLogger.performanceLogStream = performanceLogStream;

module.exports = requestLogger;

