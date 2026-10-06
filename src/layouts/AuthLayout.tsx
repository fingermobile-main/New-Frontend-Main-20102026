import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const AuthLayout: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
};
