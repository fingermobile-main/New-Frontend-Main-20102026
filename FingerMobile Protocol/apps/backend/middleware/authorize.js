const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role || (req.member && req.member.role);
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient privileges'
      });
    }

    next();
  };
};

module.exports = authorize;
