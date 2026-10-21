/**
 * Consent Guard Middleware for Node.js Express Backend
 * Enforces NDPA 2023 / GDPR / EU AI Act consent before executing sensitive controller actions.
 */
function consentGuard(requiredFlag) {
  return function (req, res, next) {
    if (requiredFlag === 'essential') {
      return next();
    }

    try {
      const user = req.user;
      let userFlags = user && user.consent_flags ? user.consent_flags : null;

      if (!userFlags && req.headers['x-consent-flags']) {
        try {
          userFlags = JSON.parse(req.headers['x-consent-flags']);
        } catch (e) {
          // ignore
        }
      }

      if (!userFlags && req.body && req.body.consent_flags) {
        userFlags = req.body.consent_flags;
      }

      const hasConsented = Boolean(userFlags && userFlags[requiredFlag] === true);

      if (!hasConsented) {
        return res.status(403).json({
          success: false,
          error: `Consent required: '${requiredFlag}' permission is not granted.`,
          required_flag: requiredFlag,
          legal_basis: requiredFlag === 'ai_training'
            ? 'EU AI Act Article 52 & GDPR Article 6(1)(a) Explicit Consent Required'
            : 'NDPA 2023 Section 31 & GDPR Article 6(1)(a)',
          action_required: 'Direct user to ConsentManager modal or /v1/users/consent to update preferences.'
        });
      }

      req.verifiedConsent = {
        flag: requiredFlag,
        timestamp: new Date().toISOString(),
        verified: true
      };

      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Internal error evaluating user consent status.'
      });
    }
  };
}

module.exports = {
  consentGuard
};
