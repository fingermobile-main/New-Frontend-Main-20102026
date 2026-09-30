import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"> {/* Auth layout with specified styling */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to FingerMobile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
