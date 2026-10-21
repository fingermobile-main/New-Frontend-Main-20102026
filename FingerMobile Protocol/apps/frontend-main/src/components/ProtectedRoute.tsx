import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const storedToken = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('fingermobile_token')) : null;
  const hasAuth = !!user || (!!storedUser && !!storedToken);

  if (loading && !hasAuth) {
    // Render a loading spinner or placeholder while checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!hasAuth) {
    // Redirect to splash for first time flow
    return <Navigate to="/splash" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
