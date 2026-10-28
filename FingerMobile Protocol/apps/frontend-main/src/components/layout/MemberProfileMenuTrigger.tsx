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
      {/* MOBILE COMPACT VIEW (< sm): Sleek, Unobtrusive 40x40px Sovereign Burger Trigger */}
      <div className="sm:hidden flex items-center">
        <button
          type="button"
          onClick={onToggleMenu}
          className={`relative w-10 h-10 rounded-full p-0.5 bg-slate-950/95 border border-slate-800 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all ring-2 ${
            isOpen ? 'ring-orange-500 bg-orange-950/40' : 'ring-orange-500/80'
          } focus:outline-none cursor-pointer`}
          title="Open Sovereign Platform Mega Menu (385 Pages)"
          aria-label="Toggle Platform Menu"
          aria-expanded={isOpen}
        >
          <img
            src={profile.avatar || '/assets/branding/default-avatar.svg'}
            alt={displayName}
            className="w-full h-full rounded-full object-cover"
          />
          {/* Active Status Beacon */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          {/* Mini Burger / Grid Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shadow-xs">
            <Grid className="w-2.5 h-2.5 text-white" />
          </span>
        </button>
      </div>

      {/* DESKTOP VIEW (sm+): Full Sovereign Profile Pill with Name, PIN, Chevron, & 9-Dot Grid */}
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
            className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/80 shadow-md"
          />
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </Link>

        {/* Platform Menu Toggle Button */}
        <button
          type="button"
          onClick={onToggleMenu}
          className="flex items-center gap-2 py-1 px-1 rounded-xl hover:bg-slate-900 transition-all text-left focus:outline-none"
          title="Open Sovereign Platform Burger Menu (385 Pages)"
          aria-expanded={isOpen}
        >
          {/* User Details (Full view on larger screens, compact on small) */}
          {!isMinimized && (
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate max-w-[110px]">
                  {displayName}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-orange-400 font-bold tracking-wide">
                  #PIN-{displayPin}
                </span>
                <span className="text-[10px] text-slate-200 font-semibold hidden md:inline">
                  • {profile.pinQuotaRemaining ?? 48} Pins
                </span>
              </div>
            </div>
          )}

          {/* FingerMobile Dropdown Chevron */}
          <div className="p-1 rounded-lg text-slate-200 group-hover:text-white transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
          </div>
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-slate-800" />

        {/* FingerMobile 9-Dot Menu Grid Trigger */}
        <button
          type="button"
          onClick={onToggleMenu}
          className={`p-2 rounded-xl transition-all flex items-center justify-center ${
            isOpen
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title="FingerMobile Platform Mega Menu (385 Pages)"
          aria-label="Toggle Platform Mega Menu"
        >
          <Grid className="w-4 h-4 text-orange-400 group-hover:scale-105 transition-transform" />
        </button>

        {/* Quick Minimize / Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="p-1 text-[10px] text-slate-500 hover:text-slate-300 hidden md:block"
          title={isMinimized ? 'Expand Profile Pill' : 'Minimize Profile Pill'}
        >
          <Sparkles className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default MemberProfileMenuTrigger;
