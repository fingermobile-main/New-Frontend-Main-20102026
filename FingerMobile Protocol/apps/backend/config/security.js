// Security configuration for the FingerMobile platform (temporary stub)

module.exports = {
  SECURITY: {
    twoFactorAuth: {
      enabled: true
    },
    rateLimiting: {
      login: {
        windowMs: 15 * 60 * 1000,
        max: 5
      }
    },
    session: {
      secret: process.env.SESSION_SECRET || 'test_secret'
    }
  }
};
