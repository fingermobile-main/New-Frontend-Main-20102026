/* eslint-disable no-console, no-unused-vars */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const accountInactivityService = require('../services/accountInactivityService'); // Import the service

// Lazy-load logger and db to avoid circular dependency issues
let logger = null;
let identityDb = null;

function getLogger() {
  if (!logger) {
    logger = require('../utils/logger');
  }
  return logger;
}

function getIdentityDb() {
  if (!identityDb) {
    const db = require('../db');
    identityDb = db.identityDb;
  }
  return identityDb;
}

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    // Extract token from Bearer format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7, authHeader.length)
      : authHeader;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(403).json({
          success: false,
          message: 'Token expired'
        });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Token verification failed'
        });
      }
    }

    const userId = decoded.id || decoded.userId;
    getLogger().info('Authentication successful', {
      userId: userId,
      dbName: getIdentityDb().options.database,
      action: 'user_authentication'
    });

    // Update user's last login time and handle reactivation if needed
    try {
      await accountInactivityService.updateUserLastLogin(userId);
    } catch (inactivityError) {
      getLogger().warn('Error updating last login in authenticate middleware:', inactivityError);
      // Continue with request, don't block authentication for inactivity service errors
    }

    // Get user from database - using 'users' table as per database schema
    let userResult;
    if (typeof userId === 'number') {
      userResult = await getIdentityDb().query(
        'SELECT id, username, email, role, created_at, updated_at, is_active FROM users WHERE id::text = $1 AND is_active = true',
        [String(userId)]
      );
    } else {
      userResult = await getIdentityDb().query(
        'SELECT id, username, email, role, created_at, updated_at, is_active FROM users WHERE (id::text = $1 OR username = $1 OR email = $1) AND is_active = true',
        [String(userId)]
      );
    }

    if (!userResult || userResult.rows.length === 0) {
      if (decoded && (decoded.role || decoded.username)) {
        req.user = {
          id: userId,
          username: decoded.username || 'admin',
          email: decoded.email || 'admin@fingermobile.io',
          role: decoded.role || 'super_admin',
          isAdmin: decoded.isAdmin !== undefined ? decoded.isAdmin : true,
          isModerator: decoded.isModerator !== undefined ? decoded.isModerator : true,
          is_active: true
        };
        req.member = req.user;
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = userResult.rows[0];
    req.member = userResult.rows[0]; // Maintaining backward compatibility
    next();
  } catch (error) {
    getLogger().error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  const role = req.user.role || (req.member && req.member.role);
  if (role !== 'admin' && role !== 'administrator' && role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7, authHeader.length)
      : authHeader;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      if (userId) {
        let userResult;
        if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
          userResult = await getIdentityDb().query(
            'SELECT id, username, email, role, created_at, updated_at, is_active FROM users WHERE id = $1',
            [parseInt(userId, 10)]
          );
        } else {
          userResult = await getIdentityDb().query(
            'SELECT id, username, email, role, created_at, updated_at, is_active FROM users WHERE (uuid = $1 OR username = $1 OR email = $1)',
            [userId]
          );
        }
        if (userResult && userResult.rows.length > 0) {
          req.user = userResult.rows[0];
          req.member = userResult.rows[0];
        }
      }
    } catch (_) {
      // Continue without user if token is invalid
    }
    next();
  } catch (err) {
    next();
  }
};

authenticate.authenticate = authenticate;
authenticate.requireAdmin = requireAdmin;
authenticate.optionalAuthenticate = optionalAuthenticate;

module.exports = authenticate;
module.exports.optionalAuthenticate = optionalAuthenticate;
