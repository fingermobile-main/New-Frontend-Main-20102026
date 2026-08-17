import React, {} from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <HomeIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
