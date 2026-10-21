import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { UserRole } from '../../types/auth';

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles }) => {
  const { user } = useAuthSession();
  const location = useLocation();

  const hasAuthorizedRole = user?.roles?.some((role) => allowedRoles.includes(role)) ?? false;

  if (!hasAuthorizedRole) {
    return <Navigate to="/" state={{ unauthorizedAttempt: location.pathname }} replace />;
  }

  return <Outlet />;
};
