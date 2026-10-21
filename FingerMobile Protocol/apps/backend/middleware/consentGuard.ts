import { Request, Response, NextFunction } from 'express';

export type ConsentFlagKey = 'essential' | 'functional' | 'analytics' | 'marketing' | 'ai_training';

export interface UserConsentRecord {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  ai_training: boolean;
  version: number;
  timestamp: string;
}

/**
 * Middleware factory to enforce specific NDPR/GDPR/EU AI Act consent flags on API routes.
 *
 * Usage:
 *   router.post('/api/v1/ai/generate-avatar', requireAuth, consentGuard('ai_training'), avatarHandler);
 *   router.post('/api/v1/analytics/dwell', consentGuard('analytics'), telemetryHandler);
 */
export const consentGuard = (requiredFlag: ConsentFlagKey) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Essential operations are always permitted
    if (requiredFlag === 'essential') {
      return next();
    }

    try {
      // 1. Check user object attached by authMiddleware (claims inside JWT)
      const user = (req as any).user;
      let userFlags: Partial<Record<ConsentFlagKey, boolean>> | undefined;

      if (user && user.consent_flags) {
        userFlags = user.consent_flags;
      }

      // 2. Check X-Consent-Flags header if client sends raw header
      if (!userFlags && req.headers['x-consent-flags']) {
        try {
          const rawHeader = req.headers['x-consent-flags'] as string;
          userFlags = JSON.parse(rawHeader);
        } catch {
          // ignore parsing error
        }
      }

      // 3. Fallback: if route has no auth and no header, check req.body.consent_flags
      if (!userFlags && req.body && req.body.consent_flags) {
        userFlags = req.body.consent_flags;
      }

      // Verify the flag
      const hasConsented = Boolean(userFlags && userFlags[requiredFlag] === true);

      if (!hasConsented) {
        res.status(403).json({
          success: false,
          error: `Consent required: '${requiredFlag}' permission is not granted.`,
          required_flag: requiredFlag,
          legal_basis: requiredFlag === 'ai_training' 
            ? 'EU AI Act Article 52 & GDPR Article 6(1)(a) Explicit Consent Required' 
            : 'NDPA 2023 Section 31 & GDPR Article 6(1)(a)',
          action_required: 'Direct user to ConsentManager modal or /v1/users/consent to update preferences.'
        });
        return;
      }

      // Add verified consent metadata to request
      (req as any).verifiedConsent = {
        flag: requiredFlag,
        timestamp: new Date().toISOString(),
        verified: true
      };

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal error evaluating user consent status.'
      });
    }
  };
};

export default consentGuard;
