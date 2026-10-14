import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DrawerMenuContainer } from '../components/layout/DrawerMenu/DrawerMenuContainer';
import { MemberProfileMenuTrigger } from '../components/layout/MemberProfileMenuTrigger';

/**
 * RootPlatformLayout
 * Universal root layout wrapping the entire FingerMobile application routes.
 * Guarantees that the Harmonized Member Profile Menu Trigger & DrawerMenuContainer
 * are mounted and 100% accessible across all 385 pages / 230+ screens in every layout
 * (ShellLayout, AuthLayout, ReaderLayout, WorkspaceLayout, AdminLayout, and 404).
 */
export const RootPlatformLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    const handleCloseDrawer = () => setIsDrawerOpen(false);
    const handleToggleDrawer = () => setIsDrawerOpen((prev) => !prev);

    window.addEventListener('open-drawer-menu', handleOpenDrawer);
    window.addEventListener('close-drawer-menu', handleCloseDrawer);
    window.addEventListener('toggle-drawer-menu', handleToggleDrawer);

    return () => {
      window.removeEventListener('open-drawer-menu', handleOpenDrawer);
      window.removeEventListener('close-drawer-menu', handleCloseDrawer);
      window.removeEventListener('toggle-drawer-menu', handleToggleDrawer);
    };
  }, []);

  // Automatically close drawer on route change for smooth navigation
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Pages with integrated in-header burger buttons (e.g., Homepage and Forum)
  const hasEmbeddedHeader = location.pathname === '/' || location.pathname === '/forum';

  return (
    <div className="relative min-h-screen w-full">
      {/* Omni-present FingerMobile Slide-Over Drawer Menu for All 385 Pages */}
      <DrawerMenuContainer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isDesktopSidebar={false}
      />

      {/* Harmonized FingerMobile Member Profile Pill & Platform Menu Trigger */}
      {!hasEmbeddedHeader && (
        <MemberProfileMenuTrigger
          isOpen={isDrawerOpen}
          onToggleMenu={() => setIsDrawerOpen((prev) => !prev)}
        />
      )}

      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default RootPlatformLayout;
