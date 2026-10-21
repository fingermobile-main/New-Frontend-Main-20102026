import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes,
max: 100, // Limit each IP to 100 requests per windowMs,
message: {
error: 'Too many requests from this IP, please try again later',
retryAfter: '15 minutes'
  },
standardHeaders: true, // Include rate limit headers in response,
keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP (prevent brute force)
 */
export const authLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes,
max: 5, // Limit each IP to 5 login/register attempts per windowMs,
message: {
error: 'Too many authentication attempts, please try again later',
retryAfter: '15 minutes'
  },
standardHeaders: true,
skipSuccessfulRequests: false, // Count failed attempts too,
keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Payment rate limiter - MOST RESTRICTIVE
 * 10 requests per minute per user (prevent payment abuse)
 */
export const paymentLimiter = rateLimit({
windowMs: 60 * 1000, // 1 minute,
max: 10, // Limit each user to 10 payment requests per minute,
message: {
error: 'Too many payment attempts, please try again in 1 minute',
retryAfter: '1 minute'
  },
  standardHeaders: true,
keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    if (req.user && req.user.id) {
      return `user-${req.user.id}`;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Wallet operations rate limiter
 * 30 requests per 5 minutes per user
 */
export const walletLimiter = rateLimit({
windowMs: 5 * 60 * 1000, // 5 minutes,
max: 30, // Limit each user to 30 wallet operations per 5 minutes,
message: {
error: 'Too many wallet operations, please try again later',
retryAfter: '5 minutes'
  },
  standardHeaders: true,
keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user-${req.user.id}`;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Staking rate limiter
 * 5 staking operations per hour per user
 */
export const stakeLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour,
max: 5, // Limit each user to 5 stakes per hour,
message: {
error: 'Too many staking attempts, maximum 5 per hour',
retryAfter: '1 hour'
  },
  standardHeaders: true,
keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user-${req.user.id}`;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Email verification rate limiter
 * 3 attempts per hour per email
 */
export const emailLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour,
max: 3, // Limit to 3 verification attempts per hour,
message: {
error: 'Too many verification attempts, please try again in 1 hour',
retryAfter: '1 hour'
  },
  standardHeaders: true,
keyGenerator: (req) => {
    return req.body.email || req.ip || 'unknown';
  }
});
