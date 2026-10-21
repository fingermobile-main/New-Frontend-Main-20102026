/* eslint-disable no-undef, no-unused-vars */
const { shouldMaskTransaction } = require('../services/fic_anonymity_service');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Extract token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Find user without password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Token is not valid' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token is not valid' });
  }
};

/**
 * Middleware to authenticate user requests
 */
const authenticateUser = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Attach user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token has expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Middleware to check if user has admin privileges
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Extend authentication middleware to handle FIC security
const authMiddleware = {
  // Verify member authentication
  verifyAuth: (req, res, next) => {
    if (req.isAuthenticated || (req.member && req.member.id)) {
      return next();
    }

    res.status(401).json({
      error: 'Unauthorized' });
  },

  // Verify FIC transaction
  verifyFICTransaction: async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      const memberId = req.member?.id;

      if (!memberId) {
        return res.status(401).json({
          error: 'Unauthorized' });
      }

      // Check if transaction should be masked for anonymity
      const maskTransaction = await shouldMaskTransaction(
        memberId,
        transactionId,
      );

      if (maskTransaction) {
        req.maskTransaction = true;
      }

      next();
    } catch (error) {
      logger.error('Error verifying FIC transaction:', error);
      res.status(500).json({
        error: 'Internal server error' });
    }
  },

  // Verify FIC anonymity settings
  verifyFICAnonymity: async (req, res, next) => {
    try {
      const memberId = req.member?.id;
      const { anonymityLevel } = req.body;

      if (!memberId) {
        return res.status(401).json({
          error: 'Unauthorized' });
      }

      // Check if member is allowed to change anonymity settings
      if (anonymityLevel && req.method === 'POST' && !req.member.isAdmin) {
        const currentSettings = await getAnonymitySettings(memberId);

        // Prevent members from setting higher anonymity levels without verification
        if (
          anonymityLevel > currentSettings.anonymityLevel &&
          !req.member.isVerified
        ) {
          return res.status(403).json({
            error: 'Higher anonymity levels require account verification'
          });
        }
      }

      next();
    } catch (error) {
      logger.error('Error verifying FIC anonymity:', error);
      res.status(500).json({
        error: 'Internal server error' });
    }
  }
};

// Basic authenticate function for backward compatibility
const authenticate = (req, res, next) => {
  // In a real implementation this would verify JWT tokens, session, etc.
  // For now, we'll mock authentication by checking if a header is present
  if (req.headers.authorization || req.session?.member || req.member) {
    // member appears to be authenticated
    // Set a mock member if needed
    if (!req.member) {
      req.member = req.session?.member || {
        id: 1,
        isAuthenticated: true
      };
    }

    return next();
  }

  // If no authentication is provided, return unauthorized
  res.status(401).json({
    error: 'Unauthorized' });
};

module.exports = {
  authenticate, // Export the authenticate function for backward compatibility
  requireAuth: authenticate, // alias for new routes
  ...authMiddleware
};
