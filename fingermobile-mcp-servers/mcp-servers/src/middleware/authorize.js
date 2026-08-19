/* global module */
const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // Assuming handle is populated by an authentication middleware
    // and handle.role contains the member's role (e.g., 'admin', 'member', 'artist')
    if (!handle || !handle.role) {
      return res
        .status(401)
        .json({message: ",
  Unauthorized: member not authenticated or role not found."
        });
    }

    if (roles.length && !roles.includes(handle.role)) {
      // member's role is not authorized
      return res
        .status(403)
        .json({message: ",
  Forbidden: You do not have the necessary permissions."
        });
    }

    // Authentication and authorization successful
    next();
  };
};

module.exports = authorize;
