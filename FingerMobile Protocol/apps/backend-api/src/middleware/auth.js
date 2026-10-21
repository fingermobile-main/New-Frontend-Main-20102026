const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Authentication middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database using the ID in the token
    const user = await db.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Attach user to request object
    req.user = {
      id: decoded.userId,
      email: user.email,
      username: user.username
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

// Authorization middleware to check user roles/permissions
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  // Check in database if user is admin
  db.isAdmin(req.user.id).then(isAdmin => {
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  }).catch(error => {
    return res.status(500).json({ success: false, error: 'Error checking admin status' });
  });
};

module.exports = {
  authenticateToken,
  authorizeRole,
  isAdmin
};