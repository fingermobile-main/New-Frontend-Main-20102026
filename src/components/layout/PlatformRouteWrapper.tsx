import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';

const PlatformRouteWrapper: React.FC = () => {
  const location = useLocation();

  // Create a dynamic title based on the path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts.length > 0
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1).replace(/-/g, ' ')
    : 'Platform';

  return (
    <MainLayout>
      <div className="bg-white min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar (Generic) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">Explore {title.toLowerCase()} and discover more.</p>

                <div className="space-y-2 mt-4">
                  <div className="h-8 bg-gray-50 rounded w-full"></div>
                  <div className="h-8 bg-gray-50 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-50 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-9 w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlatformRouteWrapper;
