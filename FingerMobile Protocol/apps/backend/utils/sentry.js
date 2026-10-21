/* eslint-disable no-unused-vars */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, 'default', { enumerable: true, value: v });
}) : function(o, v) {
  o['default'] = v;
});
var __importStar = (this && this.__importStar) || (function () {
  var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.trackTransaction = exports.captureMessage = exports.captureError = exports.sentryRequestHandler = exports.sentryErrorHandler = exports.initSentry = void 0;
const Sentry = __importStar(require('@sentry/node'));
const profiling_node_1 = require('@sentry/profiling-node');
const logger_1 = __importDefault(require('./logger'));
/**
 * Initialize Sentry error tracking
 */
const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger_1.default.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION || '1.0.0',
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    // Profiling
    integrations: [
      (0, profiling_node_1.nodeProfilingIntegration)()
    ],
    // Performance configuration
    profilesSampleRate: 1.0,
    // Breadcrumbs for debugging
    beforeBreadcrumb(breadcrumb, hint) {
      // Don't log breadcrumbs for health checks
      if (breadcrumb.message?.includes('/health')) {
        return null;
      }
      return breadcrumb;
    },
    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from error events
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      // Log to our local logger as well
      if (hint && hint.originalException) {
        logger_1.default.error('Sentry captured error:', {
          error: hint.originalException,
          eventId: event.event_id
        });
      }
      return event;
    }
  });
  logger_1.default.info('Sentry initialized successfully');
};
exports.initSentry = initSentry;
/**
 * Express error handler middleware for Sentry (v8 API)
 */
const sentryErrorHandler = (err, req, res, next) => {
  Sentry.captureException(err);
  next(err);
};
exports.sentryErrorHandler = sentryErrorHandler;
/**
 * Express request handler middleware for Sentry tracing (v8 API)
 */
const sentryRequestHandler = (req, res, next) => {
  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  if (req.user) {
    Sentry.setUser(req.user);
  }
  next();
};
exports.sentryRequestHandler = sentryRequestHandler;
/**
 * Manual error capture helper
 */
const captureError = (error, context) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};
exports.captureError = captureError;
/**
 * Manual message capture helper
 */
const captureMessage = (message, level = 'info', context) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureMessage(message, level);
  });
};
exports.captureMessage = captureMessage;
/**
 * Track transaction in Sentry
 */
const trackTransaction = (transactionData) => {
  Sentry.withScope((scope) => {
    scope.setTag('transaction_type', 'financial');
    scope.setContext('transaction', transactionData);
    Sentry.captureMessage('Financial Transaction', 'info');
  });
};
exports.trackTransaction = trackTransaction;
