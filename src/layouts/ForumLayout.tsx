import { Outlet, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

import ForumHeader from './ForumHeader';
import ForumLeftSidebar from './ForumLeftSidebar';
import ForumRightSidebar from './ForumRightSidebar';

interface ForumLayoutProps {
  children?: React.ReactNode;
}

const ForumLayout: React.FC<ForumLayoutProps> = ({ children }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-[#18191a] text-white">
      {/* Global Header - Fixed */}
      <ForumHeader 
        pageTitle={pageTitle}
        onLeftMenuToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onRightMenuToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
      />

      {/* Main Content Area with Hybrid Grid Layout */}
      <div className="pt-16"> {/* Offset for fixed header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-[1920px] mx-auto">
          
          {/* LEFT SIDEBAR - 20% on desktop (lg:col-span-3 = 25%, but we'll use custom width) */}
          <aside className={`
            fixed lg:sticky top-16 left-0 z-40
            w-64 lg:w-[20%] lg:block
            h-[calc(100vh-4rem)] overflow-y-auto
            bg-[#242526] border-r border-gray-700
            transform transition-transform duration-300 ease-in-out
            ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <ForumLeftSidebar 
              isOpen={leftSidebarOpen}
              onClose={() => setLeftSidebarOpen(false)}
            />
          </aside>

          {/* CENTER FEED - 55% on desktop */}
          <main className="
            col-span-1 lg:col-span-6 xl:col-span-7
            min-h-[calc(100vh-4rem)]
            bg-[#18191a]
          ">
            <div className="max-w-[700px] mx-auto px-4 py-6">
              {children || <Outlet />}
            </div>
          </main>

          {/* RIGHT SIDEBAR - 25% on desktop */}
          <aside className={`
            fixed lg:sticky top-16 right-0 z-40
            w-80 lg:w-[25%] lg:block
            h-[calc(100vh-4rem)] overflow-y-auto
            bg-[#242526] border-l border-gray-700
            transform transition-transform duration-300 ease-in-out
            ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <ForumRightSidebar 
              isOpen={rightSidebarOpen}
              onClose={() => setRightSidebarOpen(false)}
            />
          </aside>

        </div>
      </div>

      {/* Mobile Overlay for Sidebars */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
          role="button" tabIndex={0}
        />
      )}
    </div>
  );
};

export default ForumLayout;