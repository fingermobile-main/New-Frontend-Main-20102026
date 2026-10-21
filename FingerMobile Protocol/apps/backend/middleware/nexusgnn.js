/* eslint-disable no-unused-vars */
/**
 * NexusGNN Middleware
 * Rate limiting, validation, and caching for NexusGNN endpoints
 *,
Date: June 12, 2026
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const { RATE_LIMITS, CACHE_CONFIG } = require('../constants/nexusgnn');

/**
 * Rate limiter for find matches endpoint
 */
const findMatchesLimiter = rateLimit({
  windowMs: RATE_LIMITS.FIND_MATCHES.WINDOW_MS,
  max: RATE_LIMITS.FIND_MATCHES.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many match requests. Please try again later.',
    retryAfter: Math.ceil(RATE_LIMITS.FIND_MATCHES.WINDOW_MS / 1000)
  },
  standardHeaders: true,
  keyGenerator: (req) => req.user?.id || req.ip
});

/**
 * Rate limiter for recommendations endpoint
 */
const recommendationsLimiter = rateLimit({
  windowMs: RATE_LIMITS.GET_RECOMMENDATIONS.WINDOW_MS,
  max: RATE_LIMITS.GET_RECOMMENDATIONS.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many recommendation requests. Please try again later.',
    retryAfter: Math.ceil(RATE_LIMITS.GET_RECOMMENDATIONS.WINDOW_MS / 1000)
  },
  standardHeaders: true,
  keyGenerator: (req) => req.user?.id || req.ip
});

/**
 * Rate limiter for lifecycle updates
 */
const lifecycleUpdateLimiter = rateLimit({
  windowMs: RATE_LIMITS.UPDATE_LIFECYCLE.WINDOW_MS,
  max: RATE_LIMITS.UPDATE_LIFECYCLE.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many lifecycle update requests. Please try again later.',
    retryAfter: Math.ceil(RATE_LIMITS.UPDATE_LIFECYCLE.WINDOW_MS / 1000)
  },
  standardHeaders: true,
  keyGenerator: (req) => req.user?.id || req.ip
});

/**
 * Validate match request body
 */
const validateMatchRequest = (req, res, next) => {
  const { contentType, limit, options } = req.body;

  // Validate limit
  if (limit && (typeof limit !== 'number' || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be a number between 1 and 100'
    });
  }

  // Validate contentType if provided
  if (contentType && typeof contentType !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Content type must be a string'
    });
  }

  next();
};

/**
 * Validate content lifecycle update request
 */
const validateLifecycleUpdate = (req, res, next) => {
  const { metrics } = req.body;

  if (!metrics || typeof metrics !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Metrics object is required'
    });
  }

  // Validate required metric fields
  const requiredFields = ['impressions', 'saves', 'shares'];
  const missingFields = requiredFields.filter(field =>
    metrics[field] === undefined || typeof metrics[field] !== 'number'
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required metric,
fields: ${missingFields.join(', ')}`
    });
  }

  next();
};

/**
 * Cache middleware for match scores
 * Simple in-memory cache (use Redis in production)
 */
const matchScoreCache = new Map();

const cacheMatchScore = (req, res, next) => {
  const { userId, contentId } = req.params;
  const cacheKey = `${userId}:${contentId}`;

  const cached = matchScoreCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.MATCH_SCORE_TTL_SECONDS * 1000) {
    return res.json({
      success: true,
      message: 'Match score retrieved from cache',
      data: cached.score,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }

  // Store original json method to intercept response
  const originalJson = res.json.bind(res);

  res.json = (data) => {
    if (data.success && data.data?.score) {
      matchScoreCache.set(cacheKey, {
        score: data.data.score,
        timestamp: Date.now()
      });
    }
    return originalJson(data);
  };

  next();
};

/**
 * Clean expired cache entries (run periodically)
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of matchScoreCache.entries()) {
    if (now - value.timestamp > CACHE_CONFIG.MATCH_SCORE_TTL_SECONDS * 1000) {
      matchScoreCache.delete(key);
    }
  }
};

// Run cache cleanup every 5 minutes
setInterval(cleanExpiredCache, 5 * 60 * 1000);

/**
 * Log NexusGNN API usage for analytics
 */
const logNexusGNNUsage = (req, res, next) => {
  const startTime = Date.now();

  // Intercept response to log after completion
  const originalEnd = res.end.bind(res);

  res.end = (...args) => {
    const duration = Date.now() - startTime;

    logger.info('[NexusGNN Analytics]', {
      endpoint: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    originalEnd(...args);
  };

  next();
};

module.exports = {
  findMatchesLimiter,
  recommendationsLimiter,
  lifecycleUpdateLimiter,
  validateMatchRequest,
  validateLifecycleUpdate,
  cacheMatchScore,
  logNexusGNNUsage
};
