/* eslint-disable no-unused-vars */
const rawLogger = require('../utils/logger');
const logger = rawLogger?.default || rawLogger;

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error with context
  if (logger && typeof logger.logError === 'function') {
    logger.logError(err, {
      method: req?.method,
      url: req?.originalUrl,
      ip: req?.ip,
      userId: req?.user?.id || null
    });
  } else if (logger && typeof logger.error === 'function') {
    logger.error(`❌ Error: ${err.message}`);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : err.message || 'Unknown error',
      statusCode,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: err.stack })
    }
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  if (logger && typeof logger.warn === 'function') {
    logger.warn('Route not found', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
  }

  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError
};
