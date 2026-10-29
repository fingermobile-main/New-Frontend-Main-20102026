/**
 * FingerMobile Protocol™ Platform RBAC & Executive Access Matrix
 * Centralized Role-Based Access Control and Dashboard Permission Engine
 */

export const PRIMARY_ADMIN_EMAILS = [
  'fingermobileprotocol@gmail.com',
  'obinnambah100@gmail.com',
  'gracelinkbustech@gmail.com',
  'obinnambah@fingermobileprotocol.com'
].map((e) => e.toLowerCase());

export const SECONDARY_ADMIN_EMAILS = [
  'eunicembah@gmail.com',
  'philipatiks@yahoo.com'
].map((e) => e.toLowerCase());

/**
 * Excluded from unconditional sovereign admin bypass:
 * These emails do NOT retain automatic sovereign bypass and are strictly restricted
 * to their explicit RBAC role assignments, assignedDashboards, and permissions.
 */
export const EXCLUDED_FROM_SOVEREIGN_ADMIN_EMAILS = [
  'eunicembah@gmail.com',
  'philipatiks@yahoo.com'
].map((e) => e.toLowerCase());

export type UserRoleTier =
  | 'PRIMARY_SUPER_ADMIN'
  | 'SECONDARY_ADMIN_CFO'
  | 'ASSIGNED_MEMBER'
  | 'STANDARD_MEMBER';

export interface PlatformUserRBAC {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  assignedDashboards?: string[];
  [key: string]: any;
}

/**
 * Checks whether user is an authorized Content Creator
 */
export function isContentCreator(user?: PlatformUserRBAC | null): boolean {
  if (!user) return false;
  const role = (user.role || '').toLowerCase().trim();
  const accountType = (user.accountType || user.account_type || '').toLowerCase().trim();
  const roles = (user.roles || []).map((r: string) => r.toLowerCase().trim());
  return role === 'creator' || accountType === 'creator' || roles.includes('creator');
}

/**
 * Checks whether user is an authorized Business or Organization entity
 */
export function isBusinessEntity(user?: PlatformUserRBAC | null): boolean {
  if (!user) return false;
  const role = (user.role || '').toLowerCase().trim();
  const accountType = (user.accountType || user.account_type || '').toLowerCase().trim();
  const roles = (user.roles || []).map((r: string) => r.toLowerCase().trim());
  return (
    role === 'business' ||
    role === 'organization' ||
    accountType === 'business' ||
    roles.includes('business') ||
    roles.includes('organization')
  );
}

/**
 * Resolves the primary authorized dashboard route for a given user
 */
export function getAuthorizedDashboardPath(user?: PlatformUserRBAC | null): string | null {
  if (!user) return null;
  const tier = getUserRoleTier(user);
  if (tier === 'PRIMARY_SUPER_ADMIN' || tier === 'SECONDARY_ADMIN_CFO') {
    return '/master-dashboard';
  }
  if (isContentCreator(user)) {
    return '/creatordashboard';
  }
  if (isBusinessEntity(user)) {
    return '/businessoffices';
  }
  if (user.assignedDashboards && user.assignedDashboards.length > 0) {
    return user.assignedDashboards[0];
  }
  return null;
}

/**
 * Resolves the user's role tier based on Sovereign Executive criteria
 */
export function getUserRoleTier(user?: PlatformUserRBAC | null): UserRoleTier {
  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        effectiveUser = JSON.parse(stored);
      }
    } catch (_e) {
      // ignore
    }
  }

  if (!effectiveUser) return 'STANDARD_MEMBER';

  const email = (effectiveUser.email || '').toLowerCase().trim();
  const username = (effectiveUser.username || '').toLowerCase().trim();
  const role = (effectiveUser.role || '').toLowerCase().trim();

  // 1. Primary Admin & SuperAdmin (Owner / SuperAdmin) - Excludes non-sovereign accounts
  if (
    !EXCLUDED_FROM_SOVEREIGN_ADMIN_EMAILS.includes(email) &&
    (PRIMARY_ADMIN_EMAILS.includes(email) ||
      username === 'israelobinna' ||
      username === 'usr_founder_obinna' ||
      username === 'fingermobileprotocol' ||
      role === 'superadmin' ||
      role === 'primary admin' ||
      role === 'super_admin')
  ) {
    return 'PRIMARY_SUPER_ADMIN';
  }

  // 2. Secondary Admin & Scoped Executive (strictly governed by RBAC, excluded from sovereign super-admin)
  if (
    !EXCLUDED_FROM_SOVEREIGN_ADMIN_EMAILS.includes(email) &&
    (SECONDARY_ADMIN_EMAILS.includes(email) ||
      username === 'eunicembah' ||
      username === 'usr_cofounder_eunice' ||
      role === 'secondary admin' ||
      role === 'cfo' ||
      role === 'co-founder' ||
      role === 'cofounder')
  ) {
    return 'SECONDARY_ADMIN_CFO';
  }

  // 3. Assigned Member with explicit dashboard or RBAC rights (including Creators and Business)
  const assigned = effectiveUser.assignedDashboards || [];
  const permissions = effectiveUser.permissions || [];
  const roles = effectiveUser.roles || [];

  if (
    assigned.length > 0 ||
    permissions.length > 0 ||
    isContentCreator(effectiveUser) ||
    isBusinessEntity(effectiveUser) ||
    role === 'admin' ||
    role === 'moderator' ||
    role === 'creator' ||
    role === 'business' ||
    roles.some((r: string) => ['admin', 'moderator', 'creator', 'business', 'advertiser'].includes(r.toLowerCase()))
  ) {
    return 'ASSIGNED_MEMBER';
  }

  return 'STANDARD_MEMBER';
}

/**
 * Validates whether the user has authorization for the Master Dashboard (/master-dashboard)
 */
export function canAccessMasterDashboard(user?: PlatformUserRBAC | null): boolean {
  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        effectiveUser = JSON.parse(stored);
      }
    } catch (_e) {
      // ignore
    }
  }

  if (!effectiveUser) return false;

  const email = (effectiveUser.email || '').toLowerCase().trim();
  const isExcluded = EXCLUDED_FROM_SOVEREIGN_ADMIN_EMAILS.includes(email);

  const tier = getUserRoleTier(effectiveUser);
  if (tier === 'PRIMARY_SUPER_ADMIN' && !isExcluded) {
    return true;
  }

  if (PRIMARY_ADMIN_EMAILS.includes(email) && !isExcluded) {
    return true;
  }

  const permissions = effectiveUser.permissions || [];
  const assignedDashboards = (effectiveUser.assignedDashboards || []).map((d: string) =>
    d.toLowerCase().replace(/^\//, '')
  );

  return (
    permissions.includes('MASTER_DASHBOARD_ACCESS') ||
    permissions.includes('ALL_DASHBOARDS') ||
    assignedDashboards.includes('master-dashboard') ||
    assignedDashboards.includes('masterdashboard')
  );
}

/**
 * Determines whether a given route is a managed dashboard or administrative console
 */
export function isDashboardRoute(path: string): boolean {
  if (!path) return false;
  const clean = path.toLowerCase().replace(/^\//, '').split('?')[0];

  return (
    clean === 'dashboard' ||
    clean === 'master-dashboard' ||
    clean === 'masterdashboard' ||
    clean.includes('dashboard') ||
    clean.includes('console') ||
    clean.startsWith('admin') ||
    clean.startsWith('backoffice') ||
    clean.startsWith('council') ||
    clean === 'monitoringdashboard' ||
    clean === 'creatordashboard' ||
    clean === 'monetization-dashboard' ||
    clean === 'ugc-dashboard' ||
    clean === 'stercs-dashboard' ||
    clean === 'camusdashboard'
  );
}

/**
 * Validates whether the user can access any specific managed dashboard
 */
export function canAccessDashboard(pathOrId: string, user?: PlatformUserRBAC | null): boolean {
  if (!user) return false;

  const email = (user.email || '').toLowerCase().trim();
  const isExcluded = EXCLUDED_FROM_SOVEREIGN_ADMIN_EMAILS.includes(email);
  const tier = getUserRoleTier(user);

  // Sovereign SuperAdmins (obinnambah100@gmail.com, gracelinkbustech@gmail.com, fingermobileprotocol@gmail.com)
  // retain full unconditional access to all Dashboards and every aspect of the platform
  if (!isExcluded && (tier === 'PRIMARY_SUPER_ADMIN' || PRIMARY_ADMIN_EMAILS.includes(email))) {
    return true;
  }

  // All other accounts (including excluded emails like eunicembah@gmail.com and philipatiks@yahoo.com)
  // are strictly evaluated against their explicit RBAC permissions and assigned dashboards
  const clean = pathOrId.toLowerCase().replace(/^\//, '').split('?')[0];
  const assigned = (user.assignedDashboards || []).map((d: string) =>
    d.toLowerCase().replace(/^\//, '')
  );
  const permissions = user.permissions || [];
  const userRole = (user.role || '').toLowerCase();
  const hasCreatorAccess = isContentCreator(user);
  const hasBusinessAccess = isBusinessEntity(user);

  // Explicit dashboard assignment or ALL_DASHBOARDS permission
  if (assigned.includes(clean) || assigned.includes('*') || permissions.includes('ALL_DASHBOARDS')) {
    return true;
  }

  // Back Office operations access check
  if (clean.includes('backoffice') && (userRole === 'staff' || permissions.includes('BACKOFFICE_ACCESS') || (user.staff_roles && user.staff_roles.length > 0))) {
    return true;
  }

  // Council of Dignitaries access check
  if (clean.includes('council') && (permissions.includes('COUNCIL_ACCESS') || (user.distinguished_ranks && user.distinguished_ranks.length > 0))) {
    return true;
  }

  // Content Creator Suite access (Creator Studio, UGC Analysis, Monetization Hub, Storefront, Beatwave)
  if (hasCreatorAccess) {
    if (
      clean.includes('creator') ||
      clean.includes('ugc') ||
      clean.includes('monetiz') ||
      clean.includes('storefront') ||
      clean.includes('beatwave')
    ) {
      return true;
    }
  }

  // Business & Organization Suite access (Business Offices, Monetization Hub, Storefronts Mall, Canary Ads)
  if (hasBusinessAccess) {
    if (
      clean.includes('business') ||
      clean.includes('monetiz') ||
      clean.includes('storefront') ||
      clean.includes('canary') ||
      clean.includes('advertis')
    ) {
      return true;
    }
  }

  // Moderator dashboard
  if (clean.includes('moderat') && (userRole === 'moderator' || permissions.includes('MODERATOR_DASHBOARD') || (user.moderator_scopes && user.moderator_scopes.length > 0))) {
    return true;
  }
  if (clean.includes('canary') || clean.includes('advertis')) {
    if (userRole === 'advertiser' || permissions.includes('ADS_DASHBOARD')) return true;
  }

  return false;
}

/**
 * Returns human-readable label and designation for UI displays and badges
 */
export function getUserRoleBadge(userOrTier?: PlatformUserRBAC | UserRoleTier | null): {
  label: string;
  designation: string;
  badgeClass: string;
  badgeColor: string;
} {
  const isTierString = typeof userOrTier === 'string';
  const tier: UserRoleTier = isTierString
    ? (userOrTier as UserRoleTier)
    : getUserRoleTier(userOrTier as PlatformUserRBAC | null | undefined);

  const user = isTierString ? null : (userOrTier as PlatformUserRBAC | null | undefined);

  switch (tier) {
    case 'PRIMARY_SUPER_ADMIN': {
      const cls = 'bg-orange-100 text-orange-950 border border-orange-400 font-black';
      return {
        label: 'Primary Admin & SuperAdmin',
        designation: 'Founder & Owner | SuperAdmin',
        badgeClass: cls,
        badgeColor: cls
      };
    }
    case 'SECONDARY_ADMIN_CFO': {
      const cls = 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-black';
      return {
        label: 'Secondary Admin (CFO)',
        designation: 'Co-Founder & CFO | Secondary Admin',
        badgeClass: cls,
        badgeColor: cls
      };
    }
    case 'ASSIGNED_MEMBER': {
      if (user && isContentCreator(user)) {
        const cls = 'bg-purple-100 text-purple-950 border border-purple-400 font-black';
        return {
          label: 'Content Creator',
          designation: 'Creator Studio & UGC Broadcaster',
          badgeClass: cls,
          badgeColor: cls
        };
      }
      if (user && isBusinessEntity(user)) {
        const cls = 'bg-blue-100 text-blue-950 border border-blue-400 font-black';
        return {
          label: 'Business Organization',
          designation: 'Enterprise Merchant & Operator',
          badgeClass: cls,
          badgeColor: cls
        };
      }
      const cls = 'bg-blue-100 text-blue-950 border border-blue-400 font-black';
      return {
        label: `${user?.role || 'Assigned'} Member`,
        designation: 'Managed Console Operator',
        badgeClass: cls,
        badgeColor: cls
      };
    }
    case 'STANDARD_MEMBER':
    default: {
      const cls = 'bg-slate-100 text-slate-900 border border-slate-300 font-bold';
      return {
        label: 'Platform Member',
        designation: 'Verified Sovereign Citizen',
        badgeClass: cls,
        badgeColor: cls
      };
    }
  }
}

