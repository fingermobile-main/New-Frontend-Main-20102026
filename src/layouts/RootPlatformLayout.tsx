import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DrawerMenuContainer } from '../components/layout/DrawerMenu/DrawerMenuContainer';
import { MemberProfileMenuTrigger } from '../components/layout/MemberProfileMenuTrigger';
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

  // A member is only considered onboarded if authenticated and onboardingComplete is true
  const isOnboarded = Boolean(
    user &&
    (user.onboardingComplete || (user as any).onboarding_completed) &&
    (localStorage.getItem('onboardingComplete') === 'true' || localStorage.getItem('hasCompletedOnboarding') === 'true')
  );

  // Strict Security Rule: Never available to unboarded members or on auth/onboarding routes under any circumstance
  const canShowMenu = isOnboarded && !isAuthOrOnboardingRoute;

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

  // Pages with integrated in-header burger buttons (e.g., Homepage and Forum)
  const hasEmbeddedHeader = location.pathname === '/' || location.pathname === '/forum';

  return (
    <div className="relative min-h-screen w-full">
      {/* Omni-present FingerMobile Slide-Over Drawer Menu - ONLY available to perfectly onboarded members outside auth/onboarding */}
      {canShowMenu && (
        <DrawerMenuContainer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isDesktopSidebar={false}
        />
      )}

      {/* Harmonized FingerMobile Member Profile Pill & Platform Menu Trigger - ONLY for onboarded members */}
      {canShowMenu && !hasEmbeddedHeader && (
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
