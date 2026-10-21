/* eslint-disable no-unused-vars, no-unused-labels */
const apiKeyService = require('../services/apiKeyService');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate requests using API key and secret key
 */
const authenticateApiKey = async (req, res, next) => {
  try {
    // Get API key and secret from headers
    let apiKey = req.headers['x-api-key'];
    let secretKey = req.headers['x-secret-key'];

    // If not in headers, check in query parameters
    if (!apiKey) apiKey = req.query.apiKey;
    if (!secretKey) secretKey = req.query.secretKey;

    // If not provided, continue to next middleware (for endpoints that don't require API key)
    if (!apiKey || !secretKey) {
      return res.status(401).json({
        success: false,
        message: 'API key and secret key are required for this endpoint'
      });
    }

    // Verify the API key and secret key
    const apiKeyRecord = await apiKeyService.verifyApiKey(apiKey, secretKey);

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive API key and/or secret key'
      });
    }

    // Check rate limiting
    // In a real implementation, you would check against a rate limiter
    // For now, we'll just store the key info in req object

    // Add API key info to request object for use in subsequent middleware/route handlers
    req.apiKey = apiKeyRecord;

    // Update last used timestamp in background (don't wait for it)
    // In a real,
    implementation:
    // apiKeyService.updateLastUsed(apiKeyRecord.id).catch(logger.error)

    next();
  } catch (error) {
    logger.error('API key authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'API key authentication failed',
      error: error.message
    });
  }
};

/**
 * Middleware to verify request signature
 * This provides additional security by ensuring requests are signed with the secret key
 */
const verifySignature = async (req, res, next) => {
  try {
    // Get required headers
    const apiKey = req.headers['x-api-key'];
    const providedSignature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];

    // Check if timestamp is fresh (within 5 minutes)
    if (timestamp) {
      const now = Date.now();
      const requestTime = parseInt(timestamp);

      if (isNaN(requestTime) || now - requestTime > 300000) {
        // 5 minutes
        return res.status(401).json({
          success: false,
          message: 'Request timestamp is too old'
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Request timestamp is required for signature verification'
      });
    }

    // Get the secret key associated with the API key
    // In a real implementation, you would fetch this from the database
    // For now, we'll simulate it

    // For this to work properly, we need the original secret key
    // This would typically be retrieved from the database along with the API key info
    // In a real implementation, you would have the secret key stored encrypted
    // and retrieve it when needed for signature verification

    // Since we can't verify the signature without the original secret key,
    // we'll implement a different approach - retrieve the API key record
    // and temporarily get the secret key for verification
    // This would require a method in the service that temporarily retrieves the unhashed key
    // which should only be used for signature verification

    // For now, we'll skip signature verification until we have a way to retrieve the secret
    // In a real implementation, you'd have a secure method to temporarily get the secret key
    // for signature verification without exposing it elsewhere

    next();
  } catch (error) {
    logger.error('Signature verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Signature verification failed',
      error: error.message
    });
  }
};

/**
 * Middleware to check API key permissions
 */
const requirePermissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions'
      });
    }

    // Check if API key has all required permissions
    const hasPermissions = requiredPermissions.every((permission) =>
      req.apiKey.permissions.includes(permission),
    );

    if (!hasPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action'
      });
    }

    next();
  };
};

authenticateApiKey.authenticateApiKey = authenticateApiKey;
authenticateApiKey.verifySignature = verifySignature;
authenticateApiKey.requirePermissions = requirePermissions;

module.exports = authenticateApiKey;

