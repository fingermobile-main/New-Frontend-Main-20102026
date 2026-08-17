import { Outlet } from 'react-router-dom';
import React, {} from 'react';

import { LogoIcon } from '../icons';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-yellow-50 z-0"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full opacity-50 translate-x-1/2 translate-y-1/2 blur-2xl"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <LogoIcon className="w-12 h-12" />
          <h1
            className="text-4xl font-bold text-gray-800"
            style={{ fontFamily: "'serif'" }}
          >
            Finger
          </h1>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;