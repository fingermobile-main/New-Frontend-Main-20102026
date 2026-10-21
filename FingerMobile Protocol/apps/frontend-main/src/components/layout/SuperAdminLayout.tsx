import React, {} from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

interface SuperAdminLayoutProps {
  children?: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4">
        <div className="flex items-center gap-2">
          <StarIcon className="w-6 h-6" />
          <h1 className="text-xl font-bold">Super Admin</h1>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default SuperAdminLayout;
