"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.,
__esModule : desc.writable || desc.configurable)) {
      desc = {enumerable: true,
  get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true,
  value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {;
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", {value: true });
exports.rateLimitError = exports.conflictError = exports.notFoundError = exports.authorizationError = exports.authenticationError = exports.validationError = exports.ApiError = exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = __importStar(require("../utils/logger"));
const sentry_1 = require("../utils/sentry");
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    // Log error with context
    (0, logger_1.logError)(err, {method: req.method,
  url: req.originalUrl,
  ip: req.ip,
  userId: ((_a = req.user) === null || _a === void 0 ? void,
  0 : _a.id) || null,
  body: req.body,
  params: req.params,
  query: req.query
    });
    // Capture in Sentry for production
    if (process.env.NODE_ENV === 'production') {
        (0, sentry_1.captureError)(err, {method: req.method,
  url: req.originalUrl,
  userId: (_b = req.user) === null || _b === void 0 ? void,
  0 : _b.id
        });
    }
    // Determine status code
    const statusCode = err.statusCode || err.status || 500;
    // Prepare error response
    const errorResponse = {error: {,
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
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
    logger_1.default.warn('Route not found', {method: req.method,
  url: req.originalUrl,
  ip: req.ip
    });
    res.status(404).json({error: {,
  message: 'Route not found',
  statusCode: 404,
  path: req.originalUrl,
  timestamp: new Date().toISOString()
        }
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async handler wrapper to catch errors in async routes
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Set the prototype explicitly
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
/**
 * Validation error helper
 */
const validationError = (errors) => {
    return new ApiError(400, 'Validation failed', true);
};
exports.validationError = validationError;
/**
 * Authentication error helper
 */
const authenticationError = (message = 'Authentication required') => {
    return new ApiError(401, message, true);
};
exports.authenticationError = authenticationError;
/**
 * Authorization error helper
 */
const authorizationError = (message = 'Insufficient permissions') => {
    return new ApiError(403, message, true);
};
exports.authorizationError = authorizationError;
/**
 * Not found error helper
 */
const notFoundError = (resource = 'Resource') => {
    return new ApiError(404, `${resource} not found`, true);
};
exports.notFoundError = notFoundError;
/**
 * Conflict error helper
 */
const conflictError = (message = 'Resource already exists') => {
    return new ApiError(409, message, true);
};
exports.conflictError = conflictError;
/**
 * Rate limit error helper
 */
const rateLimitError = (retryAfter = '1 minute') => {
    const error = new ApiError(429, `Too many requests, try again in ${retryAfter}`, true);
    return error;
};
exports.rateLimitError = rateLimitError;
