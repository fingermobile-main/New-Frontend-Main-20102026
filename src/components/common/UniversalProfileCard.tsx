/*
 * FingerMobile Protocol™ - Universal Profile Card Component
 * Sovereign Identity & LushPressies Profile Standard
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  FireIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  WalletIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { VerificationBadge } from '../verification/VerificationBadge';

export interface UniversalProfileCardProps {
  className?: string;
  customUser?: {
    id?: string;
    name?: string;
    username?: string;
    headline?: string;
    avatar?: string;
    coverImage?: string;
    verificationLevel?: number;
    location?: string;
    streakDays?: number;
    level?: number;
    xpCurrent?: number;
    xpMax?: number;
    pinNumber?: string;
  };
  onEditProfile?: () => void;
}

export const UniversalProfileCard: React.FC<UniversalProfileCardProps> = ({
  className = '',
  customUser,
  onEditProfile
}) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const appContext = useAppContext();
  const ficBalance = appContext.ficBalance ?? 500;
  const gemsBalance = (appContext as any).gemsBalance ?? (appContext as any).gemBalance ?? 1250;
  const showToast = appContext.showToast;

  const [isPinRevealed, setIsPinRevealed] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  // Derive active user data with rich fallbacks
  const user = {
    id: customUser?.id || authUser?.id || 'usr_sovereign',
    name: customUser?.name || (authUser as any)?.name || `${authUser?.firstName || 'Obinna'} ${authUser?.lastName || 'Israel'}`.trim() || 'Sovereign Member',
    username: customUser?.username || authUser?.username || 'mbah_israel',
    headline: customUser?.headline || (authUser as any)?.headline || 'Protocol Architect • Sovereign Creator',
    location: customUser?.location || (authUser as any)?.location || 'Lagos, NG',
    avatar: customUser?.avatar || authUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: customUser?.coverImage || (authUser as any)?.coverImage,
    verificationLevel: customUser?.verificationLevel ?? (authUser as any)?.verificationLevel ?? 3,
    streakDays: customUser?.streakDays ?? (authUser as any)?.streakDays ?? 26,
    level: customUser?.level ?? (authUser as any)?.level ?? 7,
    xpCurrent: customUser?.xpCurrent ?? (authUser as any)?.xpCurrent ?? 4200,
    xpMax: customUser?.xpMax ?? (authUser as any)?.xpMax ?? 5000,
    pinNumber: customUser?.pinNumber || (authUser as any)?.pinNumber || '749822'
  };

  const xpPercent = Math.min(100, Math.round((user.xpCurrent / user.xpMax) * 100));

  const handleCopyPin = () => {
    setIsPinRevealed(!isPinRevealed);
    if (!isPinRevealed) {
      navigator.clipboard?.writeText(user.pinNumber);
      showToast?.(`6-Digit Protocol PIN: ${user.pinNumber} copied to clipboard!`, 'success');
    }
  };

  return (
    <div className={`universal-profile-card space-y-3.5 ${className}`}>
      {/* 1. Main Profile Identity Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100/90 dark:border-emerald-950/40 shadow-xs overflow-hidden transition-all hover:shadow-md">
        {/* Cover Image Banner */}
        <div
          className="h-24 bg-gradient-to-r from-emerald-600 via-teal-700 to-[#DC582A] relative"
          style={
            user.coverImage
              ? {
                backgroundImage: `url(${user.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
              : undefined
          }
        >
          {/* Live Sovereign Beacon Pill */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold tracking-wide border border-emerald-400/30 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active
          </div>

          {/* Quick settings gear */}
          <button
            onClick={() => navigate('/settings')}
            className="absolute top-2 left-2 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            title="Profile Settings"
          >
            <Cog6ToothIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Avatar & Details */}
        <div className="px-4 pb-4 pt-0 -mt-9 text-center relative">
          <div className="relative inline-block">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md mx-auto"
            />
            {isIncognito && (
              <span
                className="absolute bottom-0 right-0 p-1 bg-gray-800 text-white rounded-full shadow-sm"
                title="Incognito Active"
              >
                <EyeSlashIcon className="w-3 h-3" />
              </span>
            )}
            <button
              type="button"
              onClick={onEditProfile || (() => navigate('/settings'))}
              className="absolute top-0 right-0 p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-sm transition"
              title="Edit Profile"
            >
              <PencilSquareIcon className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-[200px]">
              {user.name}
            </h2>
            <VerificationBadge level={user.verificationLevel} size="small" />
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">@{user.username}</p>
          <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium mt-1 line-clamp-1">
            {user.headline}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{user.location}</p>

          {/* Consent Verified & 6-Digit PIN Pill */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 rounded-full text-[11px] text-emerald-900 dark:text-emerald-300">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Consent Verified</span>
            <button
              onClick={handleCopyPin}
              className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 ml-1"
              title="Click to reveal / copy 6-digit PIN"
            >
              <LockClosedIcon className="w-3 h-3" />
              PIN: {isPinRevealed ? user.pinNumber : `••${user.pinNumber.slice(-2)}`}
            </button>
          </div>

          {/* PIN Quota & Moderation Slot Badge */}
          <div className="mt-2 flex items-center justify-between px-3 py-1 bg-[#F5F9F6] dark:bg-gray-700/50 border border-emerald-200/60 dark:border-gray-600 rounded-xl text-[11px]">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300">PIN Quota:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">48/50</span>
              <span className="text-[10px] text-gray-400">Remaining</span>
            </div>
            <button
              onClick={() => setIsIncognito(!isIncognito)}
              className="text-[10px] font-bold text-[#DC582A] hover:underline"
              title="Toggle incognito presence"
            >
              {isIncognito ? 'Ghost: ON' : 'Incognito'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Gamification & Balances Card (Lush Rewards Style) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100/90 dark:border-emerald-950/40 shadow-xs p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-[#DC582A]" />
            Lush Rewards
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
            Level {user.level}
          </span>
        </div>

        {/* Level XP Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-mono">
            <span>XP: {user.xpCurrent} / {user.xpMax}</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{xpPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-2 border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-[10px] text-emerald-900 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1">
              <WalletIcon className="w-3 h-3 text-emerald-600" />
              FIC Balance
            </div>
            <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              {(ficBalance ?? 2500).toLocaleString()}
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/30 rounded-xl p-2 border border-amber-100 dark:border-amber-900/40">
            <div className="text-[10px] text-amber-900 dark:text-amber-300 font-semibold flex items-center justify-center gap-1">
              <FireIcon className="w-3 h-3 text-[#DC582A]" />
              Streak
            </div>
            <div className="text-sm font-extrabold text-[#DC582A] font-mono mt-0.5">
              {user.streakDays} Days 🔥
            </div>
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => navigate('/wallet')}
            className="p-1.5 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Wallet</span>
          </button>
          <button
            onClick={() => navigate('/hallmarks')}
            className="p-1.5 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">HallMarks</span>
          </button>
          <button
            onClick={() => navigate('/photocredits')}
            className="p-1.5 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalProfileCard;
