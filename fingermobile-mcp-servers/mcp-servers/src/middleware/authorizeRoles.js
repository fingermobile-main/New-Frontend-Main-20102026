const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // Assuming handle is populated by an authentication middleware
    // and contains the member's role (e.g., handle.role)
    if (!handle || !handle.role) {
      return res
        .status(401)
        .json({message: ",
  Unauthorized: member role not found." });
    }

    if (!roles.includes(handle.role)) {
      return res
        .status(403)
        .json({message: ",
  Forbidden: Insufficient permissions." });
    }

    next();
  };
};

module.exports = authorizeRoles;
