import { Request, Response, NextFunction } from 'express';
import logger, { logError } from '../utils/logger';
import { captureError } from '../utils/sentry';

/**
 * Global error handling middleware
 */
export const errorHandler = (
err: any,
req: Request,
res: Response,
next: NextFunction
): void => {
  // Log error with context
  logError(err, {
method: req.method,
url: req.originalUrl,
ip: req.ip,
userId: req.user?.id || null,
body: req.body,
params: req.params,
query: req.query
  });

  // Capture in Sentry for production
  if (process.env.NODE_ENV === 'production') {
    captureError(err, {
method: req.method,
url: req.originalUrl,
userId: req.user?.id
    });
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse: any = {
error: {
message: err.message || 'Internal Server Error',
      statusCode,
timestamp: new Date().toISOString()
    }
  };

  // Include stack trace in development only
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err.details;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
req: Request,
res: Response,
next: NextFunction): void => {
  logger.warn('Route not found', {
method: req.method,
url: req.originalUrl,
ip: req.ip
  });

  res.status(404).json({
error: {
message: 'Route not found',
statusCode: 404,
path: req.originalUrl,
timestamp: new Date().toISOString()
    }
  });
};

/**
 * Async handler wrapper to catch errors in async routes
 */
export const asyncHandler = (
fn: Function) => {
  return (
req: Request,
res: Response,
next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
statusCode: number,
message: string,
isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Validation error helper
 */
export const validationError = (
errors: any[]) => {
  return new ApiError(400, 'Validation failed', true);
};

/**
 * Authentication error helper
 */
export const authenticationError = (
message: string = 'Authentication required') => {
  return new ApiError(401, message, true);
};

/**
 * Authorization error helper
 */
export const authorizationError = (
message: string = 'Insufficient permissions') => {
  return new ApiError(403, message, true);
};

/**
 * Not found error helper
 */
export const notFoundError = (
resource: string = 'Resource') => {
  return new ApiError(404, `${resource} not found`, true);
};

/**
 * Conflict error helper
 */
export const conflictError = (
message: string = 'Resource already exists') => {
  return new ApiError(409, message, true);
};

/**
 * Rate limit error helper
 */
export const rateLimitError = (
retryAfter: string = '1 minute') => {
  const error = new ApiError(429, `Too many requests, try again in ${retryAfter}`, true);
  return error;
};
