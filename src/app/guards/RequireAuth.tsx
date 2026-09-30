import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';

interface RequireAuthProps {
  enforceMfa?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ enforceMfa = false }) => {
  const { isAuthenticated, isLoading, user } = useAuthSession();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (enforceMfa && !user?.mfaEnrolled) {
    return <Navigate to="/securitysetup" state={{ reason: 'mfa_required' }} replace />;
  }

  return <Outlet />;
};
