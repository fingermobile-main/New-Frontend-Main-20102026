import rateLimit from 'express-rate-limit';

// Define constants
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const limiter = rateLimit({
  windowMs: WINDOW_MS, // 15 minutes
  max: MAX_REQUESTS, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skip: (_req) => {
    void _req;
    // Optionally skip rate limiting for certain requests
    return false;
  },
  handler: (_req, res) => {
    void _req;
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(WINDOW_MS / 1000), // seconds to wait
    });
  }
});

export { limiter };