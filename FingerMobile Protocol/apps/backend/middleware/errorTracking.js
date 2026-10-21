/* eslint-disable no-unused-vars */
const Sentry = require('@sentry/node');
const rawLogger = require('../utils/logger');
const logger = rawLogger?.default || rawLogger;

const safeLog = (level, msg, extra) => {
  if (logger && typeof logger[level] === 'function') {
    if (extra !== undefined) logger[level](msg, extra);
    else logger[level](msg);
  } else if (level === 'error') {
    console.error(msg, extra || '');
  } else if (level === 'warn') {
    console.warn(msg, extra || '');
  } else {
    console.log(msg, extra || '');
  }
};

// Initialize Sentry if DSN is provided
let sentryInitialized = false;
if (process.env.SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
    });
    sentryInitialized = true;
    safeLog('info', '✅ Sentry initialized');
  } catch (error) {
    safeLog('warn', '⚠️  Sentry initialization failed:', error.message);
    safeLog('warn', '   Continuing without error tracking...');
  }
} else {
  safeLog('info', 'ℹ️  Sentry not configured (SENTRY_DSN not set)');
}

/**
 * Request handler - must be used before routes
 */
const sentryRequestHandler = sentryInitialized ? Sentry.Handlers.requestHandler() : (req, res, next) => next();

/**
 * Tracing handler - must be used after requestHandler but before routes
 */
const sentryTracingHandler = sentryInitialized && Sentry.Handlers.tracingHandler ? Sentry.Handlers.tracingHandler() : (req, res, next) => next();

/**
 * Error handler - must be used after routes
 */
const sentryErrorHandler = (err, req, res, next) => {
  if (sentryInitialized) {
    Sentry.captureException(err);
  }

  safeLog('error', 'ERROR:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack })
  });
};

module.exports = {
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler
};
