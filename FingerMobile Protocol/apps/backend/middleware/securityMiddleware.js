const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { SECURITY } = require('../config/security');

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: message || {
      error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Security middleware
const securityMiddleware = (app) => {
  // Enhanced Helmet configuration for security headers
  app.use(
    helmet({
      hsts: SECURITY.securityHeaders.hsts,
      frameguard: {
        action:
          SECURITY.securityHeaders.frameOptions === 'DENY'
            ? 'deny'
            : 'sameorigin'
      },
      xssFilter: SECURITY.securityHeaders.xssProtection,
      noSniff: SECURITY.securityHeaders.contentTypeOptions,
      referrerPolicy: {
        policy: SECURITY.securityHeaders.referrerPolicy },
      permittedCrossDomainPolicies: {
        permittedPolicies: 'none'
      },
      expectCt: {
        enforce: true,
        maxAge: 86400, // 1 day
      }
    }),
  );

  // CORS configuration
  app.use(cors(SECURITY.cors));

  // Additional security headers
  app.use((req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Protect against clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // XSS protection header (legacy browsers)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Force HTTPS
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }

    // Referrer policy
    res.setHeader('Referrer-Policy', 'no-referrer');

    next();
  });

  // Rate limiting for various endpoints
  const authRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.login.windowMs,
    SECURITY.rateLimiting.login.max,
    {
      error: 'Too many login attempts, please try again later.' }
  );

  const registerRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.registration.windowMs,
    SECURITY.rateLimiting.registration.max,
    {
      error: 'Too many registration attempts, please try again later.' }
  );

  const phoneVerificationRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.phoneVerification.windowMs,
    SECURITY.rateLimiting.phoneVerification.max,
    {
      error: 'Too many phone verification requests, please try again later.' }
  );

  const twoFactorRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.twoFactor.windowMs,
    SECURITY.rateLimiting.twoFactor.max,
    {
      error: 'Too many 2FA attempts, please try again later.' }
  );

  const mfaRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.mfa.windowMs,
    SECURITY.rateLimiting.mfa.max,
    {
      error: 'Too many MFA attempts, please try again later.' }
  );

  const biometricRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.biometric.windowMs,
    SECURITY.rateLimiting.biometric.max,
    {
      error:
        'Too many biometric authentication attempts, please try again later.'
    }
  );

  const backupCodesRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.backupCodes.windowMs,
    SECURITY.rateLimiting.backupCodes.max,
    {
      error: 'Too many backup codes attempts, please try again later.' }
  );

  const totpRateLimiter = createRateLimiter(
    SECURITY.rateLimiting.totp.windowMs,
    SECURITY.rateLimiting.totp.max,
    {
      error: 'Too many TOTP attempts, please try again later.' }
  );

  // Apply rate limiting to authentication routes
  app.use('/api/auth/login', authRateLimiter);
  app.use('/api/auth/register', registerRateLimiter);
  app.use('/api/auth/send-phone-verification', phoneVerificationRateLimiter);
  app.use('/api/auth/verify-phone', phoneVerificationRateLimiter);
  app.use('/api/auth/verify-2fa', twoFactorRateLimiter);
  app.use('/api/auth/verify-mfa', mfaRateLimiter);
  app.use('/api/biometric/authenticate', biometricRateLimiter);
  app.use('/api/backup-codes/verify', backupCodesRateLimiter);
  app.use('/api/authenticator/verify-login', totpRateLimiter);

  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: SECURITY.securityHeaders.csp.directives
    }),
  );
};

const handleSecurityMiddleware = (req, res, next) => {
  if (req && typeof req.use === 'function') {
    return securityMiddleware(req);
  }
  if (typeof next === 'function') {
    return next();
  }
};

handleSecurityMiddleware.securityMiddleware = handleSecurityMiddleware;
handleSecurityMiddleware.createRateLimiter = createRateLimiter;

module.exports = handleSecurityMiddleware;

