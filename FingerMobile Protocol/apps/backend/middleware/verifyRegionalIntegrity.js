const logger = require('../utils/logger');

const PHONE_DIAL_TO_COUNTRY = {
  '+234': 'NG',
  '+233': 'GH',
  '+254': 'KE',
  '+44': 'GB',
  '+1': 'US',
  '+91': 'IN',
  '+27': 'ZA',
  '+33': 'FR',
  '+49': 'DE',
  '+86': 'CN',
  '+81': 'JP',
  '+971': 'AE',
  '+55': 'BR',
  '+61': 'AU',
  '+1242': 'BS'
};

/**
 * Anti-Fraud Regional Verification Gate
 * Reconciles network IP geography with verified local phone E.164 dial codes.
 */
function verifyRegionalIntegrityMiddleware(req, res, next) {
  try {
    const { countryCode, phoneNumber } = req.body;

    if (!countryCode) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_COUNTRY_CODE',
        message: 'A valid ISO country code is required.'
      });
    }

    const normalizedCountry = countryCode.toUpperCase();

    // 1. Derive IP country from reverse proxy / CDN / Cloudflare header
    const headerCountry = (
      req.headers['cf-ipcountry'] ||
      req.headers['x-country-code'] ||
      req.headers['x-geoip-country'] ||
      ''
    ).toString().toUpperCase();

    // 2. Validate phone country prefix if phone is supplied
    if (phoneNumber) {
      // Find matching prefix in phone dial table (sorted by longest prefix first)
      const sortedPrefixes = Object.keys(PHONE_DIAL_TO_COUNTRY).sort((a, b) => b.length - a.length);
      const matchedPrefix = sortedPrefixes.find(prefix => phoneNumber.trim().startsWith(prefix));
      const phoneCountry = matchedPrefix ? PHONE_DIAL_TO_COUNTRY[matchedPrefix] : null;

      if (phoneCountry && phoneCountry !== normalizedCountry) {
        if (logger && logger.warn) {
          logger.warn(`[RegionalAntiFraud] Phone mismatch: country=${normalizedCountry}, phone=${phoneNumber}, detected=${phoneCountry}`);
        }
        return res.status(400).json({
          success: false,
          error: 'PHONE_COUNTRY_MISMATCH',
          message: `Phone number prefix does not match designated operating country (${normalizedCountry}).`
        });
      }
    }

    // 3. Flag VPN or IP location mismatches for elevated manual review
    if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1' && headerCountry !== normalizedCountry) {
      req.body.isGeoSuspect = true;
      if (logger && logger.warn) {
        logger.warn(`[RegionalAntiFraud] IP mismatch flagged: headerCountry=${headerCountry}, selectedCountry=${normalizedCountry}`);
      }
    } else {
      req.body.isGeoSuspect = false;
    }

    next();
  } catch (error) {
    if (logger && logger.error) {
      logger.error('[RegionalAntiFraud] Error during verification:', error);
    }
    return res.status(500).json({
      success: false,
      error: 'VERIFICATION_GATE_ERROR',
      message: 'Failed to complete regional fraud checks'
    });
  }
}

module.exports = {
  verifyRegionalIntegrityMiddleware,
  PHONE_DIAL_TO_COUNTRY
};
