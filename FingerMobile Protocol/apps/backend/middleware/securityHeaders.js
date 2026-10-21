/* eslint-disable no-unused-vars */
/**
 * SecurityHeadersMiddleware
 * Comprehensive security headers using helmet.js patterns
 */

const helmet = require('helmet');

// Custom security headers configuration
const securityHeaders = (req, res, next) => {
  // Strict Transport Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  res.setHeader('X-XSS-Protection', '0'); // Deprecated but still used

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (formerly Feature-Policy)
  res.setHeader('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // Content Security Policy
  res.setHeader('Content-Security-Policy',
    'default-src \'self\'; ' +
    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; ' +
    'style-src \'self\' \'unsafe-inline\'; ' +
    'img-src \'self\' data: https:; ' +
    'font-src \'self\'; ' +
    'connect-src \'self\' https:; ' +
    'frame-ancestors \'none\'; ' +
    'base-uri \'self\'; ' +
    'form-action \'self\''
  );

  // Cross-Origin policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  // Cache Control for sensitive endpoints
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Remove server header
  res.removeHeader('X-Powered-By');

  next();
};

module.exports = securityHeaders;
