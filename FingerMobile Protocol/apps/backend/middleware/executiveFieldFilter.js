/**
 * Executive Field Sanitization Middleware
 * Suppresses SuperAdmin / CFO confidential fields (margins, raw kyc, reserves, internal audit notes)
 * from payloads sent to regular platform members.
 */

const PRIMARY_ADMIN_EMAILS = [
  'fingermobileprotocol@gmail.com',
  'obinnambah100@gmail.com',
  'gracelinkbustech@gmail.com'
];

const SECONDARY_ADMIN_EMAILS = [
  'eunicembah@gmail.com',
  'philipatiks@yahoo.com'
];

const SENSITIVE_FIELD_PATTERNS = [
  'gross_margin',
  'grossMargin',
  'liquidity_reserve',
  'liquidityReserve',
  'risk_score',
  'riskScore',
  'raw_id_image_url',
  'rawIdImageUrl',
  'internal_notes',
  'internalNotes',
  'audit_internal_hash',
  'auditInternalHash',
  'settlement_bank_details',
  'settlementBankDetails',
  'server_metrics',
  'serverMetrics',
  'db_latency_ms',
  'dbLatencyMs'
];

function sanitizeObject(obj, isExecutive) {
  if (isExecutive || !obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, isExecutive));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const isSensitive = SENSITIVE_FIELD_PATTERNS.some((pattern) =>
      key.toLowerCase().includes(pattern.toLowerCase())
    );

    if (!isSensitive) {
      sanitized[key] = sanitizeObject(value, isExecutive);
    }
  }

  return sanitized;
}

function executiveFieldFilter(req, res, next) {
  const user = req.user;
  const userEmail = (user?.email || '').toLowerCase().trim();
  const isExecutive =
    PRIMARY_ADMIN_EMAILS.includes(userEmail) ||
    SECONDARY_ADMIN_EMAILS.includes(userEmail);

  // Monkey-patch res.json to automatically scrub confidential executive fields
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (!isExecutive && body && typeof body === 'object') {
      const sanitizedBody = sanitizeObject(body, false);
      return originalJson(sanitizedBody);
    }
    return originalJson(body);
  };

  next();
}

module.exports = {
  executiveFieldFilter,
  PRIMARY_ADMIN_EMAILS,
  SECONDARY_ADMIN_EMAILS,
  sanitizeObject
};
