/*
 * FingerMobile Protocol™ - Harmonized Member Profile & Platform Menu Trigger
 * Facebook-inspired platform anchor replacing floating detached button
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import userProfileSyncService from '../../services/UserProfileSyncService';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChevronDown,
  Grid,
  Menu,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface MemberProfileMenuTriggerProps {
  onToggleMenu: () => void;
  isOpen: boolean;
}

export const MemberProfileMenuTrigger: React.FC<MemberProfileMenuTriggerProps> = ({
  onToggleMenu,
  isOpen
}) => {
  const { user } = useAuth();
  const isOnboarded = Boolean(
    user &&
    (user.onboardingComplete || (user as any).onboarding_completed) &&
    (localStorage.getItem('onboardingComplete') === 'true' || localStorage.getItem('hasCompletedOnboarding') === 'true')
  );

  const [profile, setProfile] = useState(() => userProfileSyncService.getProfile());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = userProfileSyncService.subscribe((updated) => {
      setProfile(updated);
    });
    return unsubscribe;
  }, []);

  const location = useLocation();
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

  // Strict Security Rule: Never display menu trigger on auth or onboarding routes
  if (isAuthOrOnboardingRoute) {
    return null;
  }

  const displayName = (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username) || (user ? profile.name : '') || 'Guest Explorer';
  const displayPin = (user && profile.pinNumber) || '749822';

  return (
    <div className="fixed top-2 sm:top-2.5 left-2.5 sm:left-3 z-[9995] pointer-events-auto transition-all duration-300">
      {/* MOBILE COMPACT VIEW (< sm): Sleek, Ergonomic 38px Burger Icon (Zero Collision with Page Titles) */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={onToggleMenu}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md ${
            isOpen
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/40 ring-2 ring-orange-400'
              : 'bg-slate-950/90 text-orange-400 hover:text-white hover:bg-slate-900 border border-slate-800 ring-1 ring-slate-700/60'
          }`}
          title="Open Sovereign Platform Burger Menu (385 Pages)"
          aria-label="Toggle Platform Menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* DESKTOP VIEW (sm+): Compact, Non-Blocking Sovereign Menu Anchor */}
      <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 hover:bg-slate-950 text-white border border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all ring-1 ring-white/10 group">
        {/* Clickable Member Profile Picture -> Opens Member Profile Page / Wall */}
        <Link
          to="/profile"
          className="relative shrink-0 p-0.5 rounded-full hover:ring-2 hover:ring-orange-400 transition-all focus:outline-none"
          title="Click to view Member Profile Page / Wall"
        >
          <img
            src={profile.avatar || '/assets/branding/default-avatar.svg'}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500/80 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-950" />
        </Link>

        {/* Platform Menu Toggle Button */}
        <button
          type="button"
          onClick={onToggleMenu}
          className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            isOpen
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
              : 'text-slate-200 hover:text-white hover:bg-slate-900'
          }`}
          title="FingerMobile Sovereign Platform Burger Menu (385 Pages)"
          aria-label="Toggle Platform Burger Menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-4 h-4 text-orange-400 group-hover:scale-105 transition-transform" />
          <span className="text-xs font-bold text-slate-100 tracking-wide">Menu</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-400' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default MemberProfileMenuTrigger;
