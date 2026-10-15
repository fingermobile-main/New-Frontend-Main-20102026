/*
 * FingerMobile Protocol™ - Harmonized Member Profile & Platform Menu Trigger
 * Facebook-inspired platform anchor replacing floating detached button
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userProfileSyncService from '../../services/UserProfileSyncService';
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
  const [profile, setProfile] = useState(() => userProfileSyncService.getProfile());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = userProfileSyncService.subscribe((updated) => {
      setProfile(updated);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-2.5 left-3 z-[9995] pointer-events-auto transition-all duration-300">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 hover:bg-slate-950 text-white border border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all ring-1 ring-white/10 group">
        {/* Clickable Member Profile Picture -> Opens Member Profile Page / Wall */}
        <Link
          to="/profile"
          className="relative shrink-0 p-0.5 rounded-full hover:ring-2 hover:ring-orange-400 transition-all focus:outline-none"
          title="Click to view Member Profile Page / Wall"
        >
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
            alt={profile.name || 'Member Profile'}
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
            <div className="hidden sm:flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate max-w-[110px]">
                  {profile.name || 'Israel Mbah'}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-orange-400 font-bold tracking-wide">
                  #PIN-{profile.pinNumber || '749822'}
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
