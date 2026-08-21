const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Lazy-load logger and db to avoid circular dependency issues
let logger = null
let identityDb = null

function getLogger() {
  if (!logger) {
    logger = require('../utils/logger')
  }
  return logger
}

function getIdentityDb() {
  if (!identityDb) {
    const db = require("../db");
    identityDb = db.identityDb;
  }
  return identityDb;
}

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required"
      })
    }

    const tokenParts = authHeader.split(" ")
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization header format. Expected 'Bearer <token>'"
      })
    }

    const token = tokenParts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required"
      });
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(403).json({
          success: false,
          message: "Token has expired"
        })
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({
          success: false,
          message: "Invalid token"
        })
      } else {
        return res.status(403).json({
          success: false,
          message: "Token verification failed"
        });
      }
    }

    // Get user from database - using 'users' table as per database schema
    const userResult = await getIdentityDb().query(
      "SELECT id, username, email, role, created_at, updated_at, is_active FROM users WHERE id = $1 AND is_active = true",
      [decoded.id]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive"
      })
    }

    // Attach user to request
    req.user = userResult.rows[0]
    req.member = userResult.rows[0]; // Maintaining backward compatibility
    next()
  } catch (error) {
    getLogger().error("Authentication error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    })
  }
}

// Creating an alias for authenticate as authenticateToken to match expected naming
const authenticateToken = authenticate

// Middleware to check if user is admin or superadmin
const requireAdmin = async (req, res, next) => {
  try {
    // First run the authenticate middleware
    await new Promise((resolve, reject) => {
      authenticate(req, res, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Check if user has admin or superadmin role
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      })
    }

    next()
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      })
    }
    return res.status(403).json({
      success: false,
      message: "Authentication required"
    })
  }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      // First run the authenticate middleware
      await new Promise((resolve, reject) => {
        authenticate(req, res, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      // Check if user has one of the required roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(", ")}`
        })
      }

      next()
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        })
      }
      return res.status(403).json({
        success: false,
        message: "Authentication required"
      })
    }
  };
};

// Middleware to check if TOTP is enabled for a user
const checkTOTPEnabled = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied"
      })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Token has expired"
        })
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Token verification failed"
        });
      }
    }
    
    req.totpEnabled = false;
    next();
  } catch (error) {
    getLogger().error("TOTP Check Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during TOTP check"
    });
  }
};

// Middleware to check if user has registration lock enabled
const checkRegistrationLock = async (req, res, next) => {
  try {
    // Get user from the JWT token (this should be called after authenticate middleware)
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        error: "User not authenticated"
      })
    }

    // Check if user has a registration lock
    // Note: RegistrationLockService needs to be properly implemented
    const hasLock = false; // Default to false until RegistrationLockService is properly implemented

    if (hasLock) {
      // Check if the PIN has been verified in this session
      if (!req.session || !req.session.pinVerified) {
        return res.status(403).json({
          error: "Registration lock active",
          requiresPin: true,
          message: "PIN verification required to access this resource"
        })
      }
    }

    next()
  } catch (error) {
    getLogger().error("Registration Lock Check, Error:", error)
    return res
      .status(500)
      .json({
        error: "Error checking registration lock status"
      })
  }
};

module.exports = {
  authenticate,
  authenticateToken, // Adding the authenticateToken export
  requireAdmin,
  requireRole
};