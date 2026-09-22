import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

interface RequireAuthProps {
  children?: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // In a real app, this would check for authentication
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If children are provided, render them; otherwise, render Outlet
  return children ? <>{children}</> : <Outlet />;
};

interface RequireRoleProps {
  children?: React.ReactNode;
  allowedRoles: string[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, allowedRoles }) => {
  // In a real app, this would check user roles
  const userRole = localStorage.getItem('userRole') || 'user';
  const location = useLocation();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If children are provided, render them; otherwise, render Outlet
  return children ? <>{children}</> : <Outlet />;
};