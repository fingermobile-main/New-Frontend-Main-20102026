/**
 * FingerMobile Protocol™ - Phone Intelligence & Reconnaissance Service
 * Inspired by and integrated with PhoneInfoga (sundowndev/phoneinfoga)
 * Provides 2-Tier Telephony Intelligence:
 * Tier 1: Real-time In-Process Telecom Validation & Carrier Detection (< 2ms)
 * Tier 2: Deep OSINT Dorking & PhoneInfoga Sidecar Microservice Integration
 * Strictly PostgreSQL persistence.
 */

const { parsePhoneNumber } = require('libphonenumber-js/max');
const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

// Known Nigerian Carrier Prefixes (National format without +234)
const NIGERIAN_CARRIER_PREFIXES = {
  MTN: ['803', '806', '703', '706', '813', '816', '810', '814', '903', '906', '913', '916'],
  AIRTEL: ['802', '808', '708', '812', '701', '902', '901', '904', '907', '912'],
  GLO: ['805', '807', '705', '815', '811', '905', '915'],
  '9MOBILE': ['809', '817', '818', '909', '908'],
  VISAFONE: ['704', '7025', '7026'],
  SMILE: ['702']
};

// Known Disposable / Temporary SMS Gateways & Virtual VOIP Number Providers
const KNOWN_DISPOSABLE_VOIP_PREFIXES = [
  '+1201', '+1202', '+1203', '+1205', '+1206', '+1207', '+1208', '+1209', // US Virtual Pools
  '+1800', '+1888', '+1877', '+1866', '+1855', '+1844', '+1833'             // Toll-Free
];

class PhoneIntelligenceService {
  constructor() {
    this.phoneinfogaUrl = process.env.PHONEINFOGA_URL || 'http://localhost:5002';
  }

  /**
   * Helper: Detects Carrier Name for Nigerian & Global Numbers
   */
  detectCarrier(parsedNumber) {
    if (!parsedNumber) return 'Unknown Carrier';

    const country = parsedNumber.country;
    const nationalNumber = parsedNumber.nationalNumber;

    if (country === 'NG') {
      for (const [carrier, prefixes] of Object.entries(NIGERIAN_CARRIER_PREFIXES)) {
        for (const prefix of prefixes) {
          if (nationalNumber.startsWith(prefix)) {
            return `${carrier} Nigeria`;
          }
        }
      }
      return 'Nigerian Telecom Network';
    }

    if (country === 'US' || country === 'CA') {
      return 'North American Carrier';
    }

    if (country === 'GB') {
      return 'UK Mobile / Fixed Operator';
    }

    if (country === 'KE') {
      return 'Safaricom / Airtel Kenya';
    }

    if (country === 'GH') {
      return 'MTN / Vodafone Ghana';
    }

    return `${country} Telecom Operator`;
  }

  /**
   * Generate OSINT Search Engine Dorks for Manual or Automated Investigation
   */
  generateOsintDorks(e164Number, nationalNumber) {
    const cleanNumber = e164Number.replace('+', '');
    return [
      {
        engine: 'Google Footprint',
        query: `intext:"${e164Number}" OR intext:"${nationalNumber}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`intext:"${e164Number}" OR intext:"${nationalNumber}"`)}`
      },
      {
        engine: 'WhatsApp Direct Link',
        query: `wa.me/${cleanNumber}`,
        url: `https://wa.me/${cleanNumber}`
      },
      {
        engine: 'Social Media Search (Twitter / X)',
        query: `site:twitter.com "${e164Number}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`site:twitter.com "${e164Number}"`)}`
      },
      {
        engine: 'Scam & Spam Directory Check',
        query: `site:who-called.co.uk OR site:tellows.com "${e164Number}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`"${e164Number}" scam OR fraud OR spam`)}`
      },
      {
        engine: 'LinkedIn Profiles',
        query: `site:linkedin.com "${e164Number}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com "${e164Number}"`)}`
      }
    ];
  }

  /**
   * Tier 1: Real-time In-Process Analysis (< 2ms)
   * Validates format, determines country, carrier, line-type, and computes Risk Score
   */
  analyzeFast(phoneNumberRaw, defaultCountry = 'NG') {
    if (!phoneNumberRaw || typeof phoneNumberRaw !== 'string') {
      return {
        isValid: false,
        raw: phoneNumberRaw,
        error: 'Phone number string is required'
      };
    }

    let parsed = null;
    try {
      parsed = parsePhoneNumber(phoneNumberRaw, defaultCountry);
    } catch {
      // If parsing failed with default country, try with international '+'
      if (!phoneNumberRaw.startsWith('+')) {
        try {
          parsed = parsePhoneNumber('+' + phoneNumberRaw);
        } catch {
          // invalid
        }
      }
    }

    if (!parsed || !parsed.isValid()) {
      return {
        isValid: false,
        raw: phoneNumberRaw,
        e164: phoneNumberRaw,
        countryCode: null,
        country: null,
        lineType: 'INVALID',
        carrier: 'Unknown',
        isVoip: false,
        isDisposable: false,
        riskScore: 100,
        riskLevel: 'CRITICAL',
        recommendation: 'REJECT_INVALID_PHONE'
      };
    }

    const e164 = parsed.format('E.164');
    const country = parsed.country;
    const countryCode = parsed.countryCallingCode;
    const nationalNumber = parsed.nationalNumber;
    const type = parsed.getType() || 'MOBILE';

    // Carrier detection
    const carrier = this.detectCarrier(parsed);

    // VOIP & Disposable detection
    const isVoip = type === 'VOIP' || type === 'PERSONAL_NUMBER' || KNOWN_DISPOSABLE_VOIP_PREFIXES.some(p => e164.startsWith(p));
    const isTollFree = type === 'TOLL_FREE' || type === 'PREMIUM_RATE';
    const isDisposable = isVoip && (country === 'US' || country === 'CA');

    // Risk Calculation (0 - 100)
    let riskScore = 5;
    let riskLevel = 'LOW';
    let recommendation = 'ALLOW';

    if (isDisposable) {
      riskScore = 90;
      riskLevel = 'CRITICAL';
      recommendation = 'BLOCK_OR_REQUIRE_BIOMETRICS';
    } else if (isVoip) {
      riskScore = 65;
      riskLevel = 'HIGH';
      recommendation = 'FLAG_FOR_GUARDIAN_REVIEW';
    } else if (isTollFree) {
      riskScore = 80;
      riskLevel = 'HIGH';
      recommendation = 'REJECT_NON_PERSONAL_LINE';
    } else if (type === 'FIXED_LINE') {
      riskScore = 30;
      riskLevel = 'MEDIUM';
      recommendation = 'ALLOW_VERIFIED_SMS';
    }

    const dorks = this.generateOsintDorks(e164, nationalNumber);

    return {
      isValid: true,
      raw: phoneNumberRaw,
      e164,
      country,
      countryCallingCode: countryCode,
      nationalNumber,
      lineType: type,
      carrier,
      isVoip,
      isDisposable,
      isTollFree,
      riskScore,
      riskLevel,
      recommendation,
      osintFootprints: dorks
    };
  }

  /**
   * Tier 2: Deep Scan with PhoneInfoga Sidecar Microservice
   * Calls PhoneInfoga container REST API if available, falls back seamlessly to Tier 1
   */
  async deepScan(phoneNumberRaw, defaultCountry = 'NG') {
    const fastResult = this.analyzeFast(phoneNumberRaw, defaultCountry);
    if (!fastResult.isValid) return fastResult;

    let phoneinfogaData = null;

    try {
      const response = await fetch(`${this.phoneinfogaUrl}/api/v2/numbers/${fastResult.e164}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // 3 second timeout for background microservice
      });

      if (response.ok) {
        phoneinfogaData = await response.json();
      }
    } catch {
      // Non-blocking: sidecar container is optional / offline
    }

    // Persist scan result to PostgreSQL for historical auditing
    try {
      await getPool().query(
        `INSERT INTO phone_intelligence_scans
         (phone_raw, phone_e164, country_code, country_name, carrier_name, line_type, is_valid, is_voip, is_disposable, risk_score, risk_level, osint_footprints, raw_metadata, scanned_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
        [
          phoneNumberRaw,
          fastResult.e164,
          fastResult.countryCallingCode,
          fastResult.country,
          fastResult.carrier,
          fastResult.lineType,
          fastResult.isValid,
          fastResult.isVoip,
          fastResult.isDisposable,
          fastResult.riskScore,
          fastResult.riskLevel,
          JSON.stringify(fastResult.osintFootprints),
          JSON.stringify(phoneinfogaData || { engine: 'FingerBio_Native_Intelligence' })
        ]
      );
    } catch (dbErr) {
      if (logger && typeof logger.warn === 'function') {
        logger.warn('Failed to persist phone_intelligence_scan:', dbErr.message);
      }
    }

    return {
      ...fastResult,
      phoneinfoga: phoneinfogaData,
      scannedAt: new Date().toISOString()
    };
  }

  /**
   * Retrieves previous scan history for a phone number from PostgreSQL
   */
  async getScanHistory(e164Number) {
    try {
      const res = await getPool().query(
        'SELECT * FROM phone_intelligence_scans WHERE phone_e164 = $1 ORDER BY scanned_at DESC LIMIT 5',
        [e164Number]
      );
      return res.rows;
    } catch (err) {
      return [];
    }
  }
}

module.exports = new PhoneIntelligenceService();

