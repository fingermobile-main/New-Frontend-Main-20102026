const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Webhook Signature Verification Middleware
 * Verifies HMAC signature on incoming webhook requests
 */
function webhookSignature(req, res, next) {
  try {
    const signature = req.headers['x-webhook-signature'];
    const secret = req.headers['x-webhook-secret'] || process.env.WEBHOOK_SECRET;

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Webhook secret not configured'
      });
    }

    // Generate expected signature
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // Compare signatures using timing-safe comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Signature is valid, proceed
    next();
  } catch (error) {
    logger.error('Error verifying webhook signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify webhook signature'
    });
  }
}

module.exports = webhookSignature;
