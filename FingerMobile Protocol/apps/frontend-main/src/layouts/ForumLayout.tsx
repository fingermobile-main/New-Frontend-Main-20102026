import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';

import ForumHeader from './ForumHeader';

interface ForumLayoutProps {
  children?: React.ReactNode;
}

const ForumLayout: React.FC<ForumLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Extract page title from route or use default
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/forum')) return 'Community Forum';
    if (path.includes('/gems')) return 'Gems';
    if (path.includes('/blogs')) return 'Blogs';
    if (path.includes('/groups')) return 'Groups';
    if (path.includes('/hallmarks')) return 'Hallmarks';
    if (path.includes('/mii')) return 'Mii';
    return 'FingerMobile';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="max-w-7xl mx-auto pt-16 mt-4">
      {/* Global Header */}
      <ForumHeader pageTitle={pageTitle} />

      {/* 3-column structure */}
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - 20% width */}
        <aside className="w-full md:w-1/5 p-4 bg-gray-800">
          {/* Left sidebar content will go here */}
        </aside>

        {/* Main Content - 55% width */}
        <main className="w-full md:w-2/5 p-4">
          {children || <Outlet />}
        </main>

        {/* Right Sidebar - 25% width */}
        <aside className="w-full md:w-1/4 p-4 bg-gray-800">
          {/* Right sidebar content will go here */}
        </aside>
      </div>
    </div>
  );
};

export default ForumLayout;
