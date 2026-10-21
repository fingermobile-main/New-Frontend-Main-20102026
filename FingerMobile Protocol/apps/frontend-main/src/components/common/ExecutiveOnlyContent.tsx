/**
 * ExecutiveOnlyContent & Platform Privilege Security Guard
 * Masks confidential SuperAdmin/CFO data, metrics, and actions on member-facing screens.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getUserRoleTier,
  canAccessMasterDashboard,
  canAccessDashboard,
  PRIMARY_ADMIN_EMAILS,
  SECONDARY_ADMIN_EMAILS,
  UserRoleTier
} from '../../services/platformRbac';

export interface PlatformPrivilegeState {
  isPrimaryAdmin: boolean;
  isCfo: boolean;
  isExecutive: boolean;
  roleTier: UserRoleTier;
  canAccessMaster: boolean;
  canAccessRoute: (routePath: string) => boolean;
  userEmail: string;
}

export const usePlatformPrivilege = (): PlatformPrivilegeState => {
  const { user } = useAuth();
  const roleTier = getUserRoleTier(user);
  const email = (user?.email || '').toLowerCase().trim();

  const isPrimaryAdmin = PRIMARY_ADMIN_EMAILS.includes(email) || roleTier === 'PRIMARY_SUPER_ADMIN';
  const isCfo = SECONDARY_ADMIN_EMAILS.includes(email) || roleTier === 'SECONDARY_ADMIN_CFO';
  const isExecutive = isPrimaryAdmin || isCfo;
  const canAccessMaster = canAccessMasterDashboard(user);

  const canAccessRoute = (routePath: string): boolean => {
    return canAccessDashboard(routePath, user);
  };

  return {
    isPrimaryAdmin,
    isCfo,
    isExecutive,
    roleTier,
    canAccessMaster,
    canAccessRoute,
    userEmail: email
  };
};

interface ExecutiveOnlyContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * If true, allows CFO in addition to Primary SuperAdmin.
   * Default: true.
   */
  allowCfo?: boolean;
}

export const ExecutiveOnlyContent: React.FC<ExecutiveOnlyContentProps> = ({
  children,
  fallback = null,
  allowCfo = true
}) => {
  const { isPrimaryAdmin, isCfo, isExecutive } = usePlatformPrivilege();

  const authorized = allowCfo ? isExecutive : isPrimaryAdmin;

  if (!authorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ExecutiveOnlyContent;
