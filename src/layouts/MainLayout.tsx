import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
  onMenuToggle?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle, onMenuToggle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          pageTitle={pageTitle}
          onMenuToggle={() => {
            setSidebarOpen(!sidebarOpen);
            // Call the passed onMenuToggle if provided
            if (onMenuToggle) {
              onMenuToggle();
            }
          }}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
