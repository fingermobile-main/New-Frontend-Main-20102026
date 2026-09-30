import { Navigate, Outlet } from 'react-router-dom';
import React, {} from 'react';

import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  permission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permission }) => {
  // @ts-expect-error: auto-fixed by agent
  const { member, hasPermission, loading } = useAuth();

  if (loading) {
    // You might want to show a loading spinner here instead of a blank screen
    return null;
  }

  if (!member) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    // Redirect to home if member doesn't have the required permission
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
