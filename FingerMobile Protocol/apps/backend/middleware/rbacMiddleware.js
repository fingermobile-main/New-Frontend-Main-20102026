'use strict';

/**
 * FingerMobile Protocol™ - Enterprise RBAC & Member Gatekeeper Middleware
 * Validates staff collaborator permissions, role scopes, and member-gated page access.
 */

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role || req.headers['x-user-role'] || 'user';
    const collaboratorRoles = req.user?.collaboratorRoles || [];

    const rolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Admin / Owner override
    if (userRole === 'admin' || userRole === 'owner' || userRole === 'super_admin') {
      return next();
    }

    const hasDirectRole = rolesList.includes(userRole);
    const hasCollaboratorRole = collaboratorRoles.some((r) => rolesList.includes(r));

    if (hasDirectRole || hasCollaboratorRole) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: insufficient role privileges',
      requiredRoles: rolesList,
      userRole,
    });
  };
};

const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role || req.headers['x-user-role'] || 'user';
    const permissions = req.user?.permissions || req.permissions || [];

    // Master admins bypass node check
    if (userRole === 'admin' || userRole === 'owner' || userRole === 'super_admin') {
      return next();
    }

    if (permissions.includes('*') || permissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied: missing permission '${requiredPermission}'`,
      requiredPermission,
    });
  };
};

const validateLocationScope = (req, res, next) => {
  const locationScope = req.user?.locationScope || { type: 'ALL', locationIds: [] };
  const requestedLocation = req.params.locationId || req.query.locationId || req.body.locationId;

  if (locationScope.type === 'ALL' || !requestedLocation) {
    return next();
  }

  if (locationScope.locationIds && locationScope.locationIds.includes(requestedLocation)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: collaborator is not assigned to this business location',
    requestedLocation,
  });
};

const validateMemberPageAccess = (req, res, next) => {
  const memberRoles = req.user?.memberRoles || ['mem_role_subscriber'];
  const memberBadges = req.user?.badges || [];
  const requestedPageId = req.params.pageId || req.query.pageId;

  // Collaborators with admin status have universal viewing access
  if (req.user?.role === 'admin' || req.user?.role === 'owner') {
    return next();
  }

  req.memberAccess = {
    roles: memberRoles,
    badges: memberBadges,
    targetPage: requestedPageId,
  };

  next();
};

module.exports = {
  requireRole,
  requirePermission,
  validateLocationScope,
  validateMemberPageAccess,
};
