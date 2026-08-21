/**
 * STERCS Integration Middleware for FingerMobile Platform
 * Sends session tracking data to STERCS standalone service
 * 
 * Installation: Add this middleware to apps/backend/middleware/stercsTracker.js
 */

const axios = require('axios');
const logger = require('../utils/logger'); // Adjust path as needed

// STERCS API Configuration
const STERCS_API_URL = process.env.STERCS_API_URL || 'http://stercs-backend:3022'
const STERCS_API_KEY = process.env.STERCS_API_KEY || 'your_api_key_here'

// Module name mapping
const MODULE_MAP = {
  '/api/photocredits': 'PhotoCredits',
  '/api/storefront': 'Storefront',
  '/api/fingerwars': 'FingerWars',
  '/api/wallet': 'Wallet',
  '/api/fingerlux': 'FingerLux',
  '/api/forum': 'Forum',
  '/api/flamingo': 'Flamingo',
  '/api/trends': 'Trends',
  '/api/beatwaveng': 'BeatwaveNG',
  '/api/imperial-builder': 'ImperialBuilder',
  '/api/gems': 'Gems',
}

/**
 * Extract module name from request path
 */
function extractModuleName(req) {
  const pathParts = req.path.split('/').filter(p => p)
  
  for (const [path, moduleName] of Object.entries(MODULE_MAP)) {
    if (req.path.startsWith(path)) {
      return moduleName
    }
  }
  
  return 'Unknown'
}

/**
 * Determine action type from HTTP method and path
 */
function determineAction(method, path) {
  const methodActions = {
    GET: 'read',
    POST: 'create',
    PUT: 'update',
    PATCH: 'update',
    DELETE: 'delete',
  };

  return methodActions[method] || 'unknown';
}

/**
 * STERCS Session Tracking Middleware
 * Tracks all authenticated requests and sends to STERCS service
 * Fire-and-forget pattern - never blocks main request flow
 */
async function trackSessionToSTERCS(req, res, next) {
  try {
    // Only track authenticated users
    if (!req.user?.id) {
      return next()
    }

    // Don't track health checks or static assets
    if (req.path.startsWith('/health') || req.path.includes('.')) {
      return next()
    }

    const moduleName = extractModuleName(req)
    const actionType = determineAction(req.method, req.path)

    // Prepare session data
    const sessionData = {
      userId: req.user.id,
      username: req.user.username || req.user.email || 'unknown',
      moduleName,
      sessionId: req.sessionID || req.headers['x-session-id'],
      actionType,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      requestPath: req.originalUrl,
      requestMethod: req.method,
      statusCode: null, // Will be set after response
      responseTimeMs: null, // Will be set after response
      metadata: {
        query_params: Object.keys(req.query).length > 0 ? req.query : undefined,
        body_keys: req.body && Object.keys(req.body).length > 0 ? Object.keys(req.body) : undefined,
      },
    }

    // Capture response time and status code
    const startTime = Date.now()
    
    // Hook into response finish event
    res.on('finish', () => {
      sessionData.statusCode = res.statusCode
      sessionData.responseTimeMs = Date.now() - startTime

      // Send to STERCS (fire-and-forget)
      sendToSTERCS(sessionData).catch(err => {
        logger.error('Failed to send session data to STERCS:', err.message)
      })
    })

    next()
  } catch (error) {
    // Never block main flow - log error and continue
    logger.error('Error in STERCS tracking middleware:', error)
    next()
  }
}

/**
 * Send session data to STERCS API
 */
async function sendToSTERCS(sessionData) {
  try {
    const response = await axios.post(
      `${STERCS_API_URL}/api/session-traces/track`,
      sessionData,
      {
        headers: {
          'X-API-Key': STERCS_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 1000, // 1 second timeout - don't wait long
      }
    )

    logger.debug(`Session tracked to STERCS: ${sessionData.userId} -> ${sessionData.moduleName}`)
    return response.data
  } catch (error) {
    // Log but don't throw - this is fire-and-forget
    if (error.code === 'ECONNABORTED') {
      logger.warn('STERCS tracking timeout (non-critical)')
    } else {
      logger.error('STERCS tracking failed:', error.message)
    }
    return null
  }
}

/**
 * Webhook handler for receiving STERCS alerts
 * Mount this route in your main app: app.use('/webhooks/stercs', stercsWebhookHandler)
 */
function stercsWebhookHandler(req, res) {
  try {
    const { eventType, severity, details, timestamp } = req.body

    // Verify webhook signature if configured
    const signature = req.headers['x-webhook-signature']
    if (signature && !verifyWebhookSignature(req.body, signature)) {
      logger.warn('Invalid webhook signature received')
      return res.status(401).json({ success: false, message: 'Invalid signature' })
    }

    // Handle different event types
    switch (eventType) {
      case 'critical_security_alert':
        handleCriticalSecurityAlert(details)
        break
      case 'lockdown_triggered':
        handleLockdownTriggered(details)
        break
      case 'compliance_report_ready':
        handleComplianceReportReady(details);
        break;
      case 'violation_threshold_exceeded':
        handleViolationThreshold(details);
        break;
      case 'injection_attempt_blocked':
        handleInjectionAttempt(details);
        break;
      default:
        logger.info(`Received STERCS webhook: ${eventType}`);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    logger.error('Error handling STERCS webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Verify webhook signature (HMAC-SHA256)
 */
function verifyWebhookSignature(payload, signature) {
  const crypto = require('crypto');
  const secret = process.env.STERCS_WEBHOOK_SECRET || 'webhook_secret_2026';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Event handlers for STERCS webhooks
 */
function handleCriticalSecurityAlert(details) {
  logger.critical('CRITICAL SECURITY ALERT from STERCS:', details);
  // TODO: Send to PagerDuty, Slack, email, etc.
}

function handleLockdownTriggered(details) {
  logger.warn('LOCKDOWN TRIGGERED by STERCS:', details)
  // TODO: Activate platform-wide lockdown mechanisms
}

function handleComplianceReportReady(details) {
  logger.info('Compliance report ready:', details)
  // TODO: Notify compliance team, store report
}

function handleViolationThreshold(details) {
  logger.warn('Violation threshold exceeded:', details)
  // TODO: Alert security team, consider account suspension
}

function handleInjectionAttempt(details) {
  logger.warn('Injection attempt detected:', details)
  // TODO: Block IP, alert security team
}

module.exports = {
  trackSessionToSTERCS,
  stercsWebhookHandler,
}
