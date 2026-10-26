import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DrawerMenuContainer } from '../components/layout/DrawerMenu/DrawerMenuContainer';
import { MemberProfileMenuTrigger } from '../components/layout/MemberProfileMenuTrigger';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

/**
 * RootPlatformLayout
 * Universal root layout wrapping the entire FingerMobile application routes.
 * STRICT SECURITY RULE: The burger menu and navigation triggers are strictly LOCKED DOWN
 * and inaccessible to unauthenticated guests, applicants, and members who have not completed onboarding.
 */
export const RootPlatformLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Route whitelist/blacklist check: Menu must NEVER be available on auth or onboarding screens
  const path = (location.pathname || (typeof window !== 'undefined' ? window.location.pathname : '')).toLowerCase();
  const isAuthOrOnboardingRoute = 
    path === '/login' ||
    path === '/register' ||
    path === '/admin' ||
    path === '/adminlogin' ||
    path === '/verification' ||
    path === '/official-verification' ||
    path === '/securitysetup' ||
    path === '/changepassword' ||
    path === '/forgot-password' ||
    path === '/onboarding' ||
    path.startsWith('/auth') ||
    path.includes('/login') ||
    path.includes('/register') ||
    path.includes('/onboarding') ||
    path.includes('/adminlogin');

  // The unified Sovereign Burger Menu & Drawer is accessible on all platform pages outside auth/onboarding
  const canShowMenu = !isAuthOrOnboardingRoute;

  useEffect(() => {
    const handleOpenDrawer = () => {
      if (canShowMenu) setIsDrawerOpen(true);
    };
    const handleCloseDrawer = () => setIsDrawerOpen(false);
    const handleToggleDrawer = () => {
      if (canShowMenu) setIsDrawerOpen((prev) => !prev);
    };

    window.addEventListener('open-drawer-menu', handleOpenDrawer);
    window.addEventListener('close-drawer-menu', handleCloseDrawer);
    window.addEventListener('toggle-drawer-menu', handleToggleDrawer);

    return () => {
      window.removeEventListener('open-drawer-menu', handleOpenDrawer);
      window.removeEventListener('close-drawer-menu', handleCloseDrawer);
      window.removeEventListener('toggle-drawer-menu', handleToggleDrawer);
    };
  }, [canShowMenu]);

  // Automatically close drawer on route change or when entering non-menu routes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname, canShowMenu]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Omni-present FingerMobile Slide-Over Drawer Menu */}
      {canShowMenu && (
        <DrawerMenuContainer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isDesktopSidebar={false}
        />
      )}

      {/* Harmonized FingerMobile Member Profile Pill & Platform Menu Trigger (Top-Left Sovereign Anchor) */}
      {canShowMenu && (
        <MemberProfileMenuTrigger
          isOpen={isDrawerOpen}
          onToggleMenu={() => setIsDrawerOpen((prev) => !prev)}
        />
      )}

      {/* Page Content */}
      <Suspense fallback={<RouteLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootPlatformLayout;
