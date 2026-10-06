import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import { DrawerMenuContainer } from '../components/layout/DrawerMenu/DrawerMenuContainer';
import { useAuth } from '../hooks/useAuth';

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Slide-over Drawer Menu (Zero permanent sidebar on screen) */}
      <DrawerMenuContainer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isDesktopSidebar={false}
      />

      {/* Header */}
      <Header
        sidebarOpen={drawerOpen}
        onToggleSidebar={() => setDrawerOpen(!drawerOpen)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main page content - Full clean canvas width */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
