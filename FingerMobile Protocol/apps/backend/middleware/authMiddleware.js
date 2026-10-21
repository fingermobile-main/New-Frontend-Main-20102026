const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.header('Authorization') || req.headers['authorization'];
  const token = authHeader?.replace('Bearer ', '') || authHeader?.split(' ')[1];

  if (!token) {
    if (req.user || req.member) return next();
    return res.status(401).json({ success: false, message: 'Authorization required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    const role = (req.user?.role || req.member?.role || '').toLowerCase();
    if (role === 'superadmin' || role === 'admin') {
      return next();
    }
    return res.status(403).json({ success: false, message: 'SuperAdmin access required' });
  });
};

module.exports = {
  requireAuth,
  requireSuperAdmin,
  authenticateUser: requireAuth
};
