/**
 * RateLimiterMiddleware
 * API throttling to prevent abuse and ensure fair usage
 * Enhanced with granular controls for different endpoint types
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Try to use Redis for distributed rate limiting, fallback to memory
let rateLimitStore
let redisClient = null

try {
  const RedisStore = require('rate-limit-redis')
  const Redis = require('ioredis')
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
  
  rateLimitStore = new RedisStore({
sendCommand: (...args) => redisClient.call(...args)
  })
  logger.info('✅ Rate limiter using Redis store')
} catch (error) {
  logger.warn('⚠️  Redis not available, using in-memory rate limiter')
  rateLimitStore = undefined; // Use default memory store
  redisClient = null
}

// General API rate limiter
const apiLimiter = rateLimit({
store: rateLimitStore,
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // Limit each IP to 100 requests per windowMs
message: {
success: false,
error: 'Too many requests, please try again later',
retryAfter: 900 // seconds
  },
standardHeaders: true,
keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown'
  }
})

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
store: rateLimitStore,
windowMs: 15 * 60 * 1000, // 15 minutes
max: 5, // Limit each IP to 5 login attempts per windowMs
message: {
success: false,
error: 'Too many authentication attempts, please try again later',
retryAfter: 900
  },
skipSuccessfulRequests: true
})

// Upload rate limiter
const uploadLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 60 * 1000, // 1 hour,
max: 20, // Limit each IP to 20 uploads per hour,
message: {
success: false,
error: 'Upload limit exceeded, please try again later',
retryAfter: 3600
  }
})

// Search rate limiter
const searchLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 1000, // 1 minute,
max: 30, // Limit each IP to 30 searches per minute,
message: {
success: false,
error: 'Search limit exceeded, please slow down',
retryAfter: 60
  }
})

// NEW: Payment/Critical operations limiter
const paymentLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 60 * 1000, // 1 hour,
max: 10, // Limit each IP to 10 payment operations per hour
message: {
success: false,
error: 'Payment operation limit exceeded, please try again later',
retryAfter: 3600
  },
keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip || 'unknown'
  }
})

// NEW: Write operations limiter (POST/PUT/DELETE)
const writeOperationLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 1000, // 1 minute
max: 30, // Limit each IP to 30 write operations per minute
message: {
success: false,
error: 'Write operation limit exceeded, please slow down',
retryAfter: 60
  },
keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown'
  }
})

// NEW: Admin/Management endpoints limiter
const adminLimiter = rateLimit({
store: rateLimitStore,
windowMs: 15 * 60 * 1000, // 15 minutes
max: 50, // Limit each admin to 50 operations per 15 minutes
message: {
success: false,
error: 'Admin operation limit exceeded',
retryAfter: 900
  },
keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown'
  }
})

// NEW: Terminal/Command execution limiter (for stercs-editor)
const terminalLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 1000, // 1 minute
max: 10, // Limit each user to 10 terminal commands per minute
message: {
success: false,
error: 'Terminal command limit exceeded, please slow down',
retryAfter: 60
  },
keyGenerator: (req) => {
    return req.user?.id || req.memberId || req.ip || 'unknown'
  }
})

// NEW: API key based limiter (for service-to-service calls)
const apiKeyLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 1000, // 1 minute
max: 60, // Limit each API key to 60 requests per minute
message: {
success: false,
error: 'API rate limit exceeded',
retryAfter: 60
  },
keyGenerator: (req) => {
    return req.headers['x-api-key'] || req.ip || 'unknown'
  }
})

// NEW: Email/SMS notification limiter
const notificationLimiter = rateLimit({
store: rateLimitStore,
windowMs: 60 * 60 * 1000, // 1 hour
max: 20, // Limit each user to 20 notifications per hour
message: {
success: false,
error: 'Notification limit exceeded, please try again later',
retryAfter: 3600
  },
keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown'
  }
})

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  searchLimiter,
  paymentLimiter,
  writeOperationLimiter,
  adminLimiter,
  terminalLimiter,
  apiKeyLimiter,
  notificationLimiter,
  redisClient
}
