import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import logger from './logger';

/**
 * Initialize Sentry error tracking
 */
export const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.warn('Sentry DSN not configured. Error tracking disabled.');
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
      nodeProfilingIntegration()
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
        logger.error('Sentry captured error:', {
          error: hint.originalException,
          eventId: event.event_id
        });
      }

      return event;
    }
  });

  logger.info('Sentry initialized successfully');
};

/**
 * Express error handler middleware for Sentry (v8 API)
 */
export const sentryErrorHandler = (err: any, req: any, res: any, next: any) => {
  Sentry.captureException(err);
  next(err);
};

/**
 * Express request handler middleware for Sentry tracing (v8 API)
 */
export const sentryRequestHandler = (req: any, res: any, next: any) => {
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

/**
 * Manual error capture helper
 */
export const captureError = (error: Error, context?: any) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

/**
 * Manual message capture helper
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: any) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureMessage(message, level);
  });
};

/**
 * Track transaction in Sentry
 */
export const trackTransaction = (transactionData: any) => {
  Sentry.withScope((scope) => {
    scope.setTag('transaction_type', 'financial');
    scope.setContext('transaction', transactionData);
    Sentry.captureMessage('Financial Transaction', 'info');
  });
};
