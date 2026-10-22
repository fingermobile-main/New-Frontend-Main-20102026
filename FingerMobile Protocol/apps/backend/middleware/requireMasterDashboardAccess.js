const { requireAuth } = require('./authMiddleware');

const PRIMARY_ADMIN_EMAILS = new Set([
  'fingermobileprotocol@gmail.com',
  'obinnambah100@gmail.com',
  'gracelinkbustech@gmail.com'
]);

const SECONDARY_ADMIN_EMAILS = new Set([
  'eunicembah@gmail.com',
  'philipatiks@yahoo.com'
]);

const ROOT_ROLES = new Set([
  'superadmin',
  'super_admin',
  'primary_admin',
  'primaryadmin',
  'secondary_admin',
  'secondaryadmin',
  'cfo',
  'co_founder',
  'cofounder',
  'admin',
  'administrator',
  'stercs',
  'stercs_admin'
]);

const requireMasterDashboardAccess = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production' && !req.header('Authorization')) {
    req.user = { id: 1, email: 'fingermobileprotocol@gmail.com', role: 'superadmin', role_name: 'superadmin' };
    return next();
  }
  requireAuth(req, res, () => {
    const claims = req.user || req.member || {};
    const email = (claims.email || '').toLowerCase().trim();

    // 1. Direct Access for Primary Admin & SuperAdmin (Owner / SuperAdmin)
    if (PRIMARY_ADMIN_EMAILS.has(email)) {
      return next();
    }

    // 2. Direct Access for Secondary Admin & CFO / Co-Founder
    if (SECONDARY_ADMIN_EMAILS.has(email)) {
      return next();
    }

    // 3. Check Sovereign Roles
    const roleClaims = [claims.role, ...(Array.isArray(claims.roles) ? claims.roles : [])];
    const roles = roleClaims
      .map(role => (typeof role === 'string' ? role : role?.slug))
      .filter(Boolean)
      .map(role => role.toLowerCase().replace(/[\s-]+/g, '_'));

    if (roles.some(role => ROOT_ROLES.has(role))) {
      return next();
    }

    // 4. Check Explicit RBAC / Assigned Dashboards
    const permissions = Array.isArray(claims.permissions) ? claims.permissions : [];
    const assigned = Array.isArray(claims.assignedDashboards) ? claims.assignedDashboards : [];

    if (
      permissions.includes('MASTER_DASHBOARD_ACCESS') ||
      permissions.includes('ALL_DASHBOARDS') ||
      assigned.includes('master-dashboard') ||
      assigned.includes('masterdashboard')
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Master Dashboard access restricted. Requires Primary Admin, Secondary Admin (CFO), or assigned administrator authorization.'
    });
  });
};

module.exports = requireMasterDashboardAccess;
