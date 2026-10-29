import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SparklesIcon,
  FireIcon,
  ShieldCheckIcon,
  RadioIcon,
  EyeSlashIcon,
  HeartIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  WalletIcon,
  HomeIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  TvIcon,
  MusicalNoteIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { VerificationBadge } from '../verification/VerificationBadge';

interface ProtocolLushDrawerProps {
  member?: any;
  ficBalance?: number;
  onLogout?: () => void;
  onCloseMobile?: () => void;
}

export function ProtocolLushDrawer({
  member,
  ficBalance = 2850,
  onLogout,
  onCloseMobile
}: ProtocolLushDrawerProps) {
  const location = useLocation();
  const [isRadiating, setIsRadiating] = useState(true);
  const [isIncognito, setIsIncognito] = useState(false);

  // User details with official founder defaults
  const displayName = member?.name || member?.displayName || 'Mbah Israel Obinna';
  const username = member?.username || 'obinna_founder';
  const headline = member?.headline || 'CEO & CTO, Founder | FingerMobile Protocol';
  const avatarUrl = member?.avatar || member?.photoURL || '/assets/branding/mbah_israel_obinna.jpeg';
  const userLocation = member?.location || 'Lagos, Nigeria & Sovereign Metaverse';
  const verificationLevel = member?.verificationLevel ?? 5;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Live Feed', href: '/feed', icon: NewspaperIcon, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold' },
    { name: 'Wallet & Vault', href: '/wallet', icon: WalletIcon, badge: 'Infinite Coin', badgeColor: 'bg-amber-100 text-amber-900 font-bold' },
    { name: 'Guardian Protection', href: '/guardian-protection', icon: ShieldCheckIcon, badge: 'STERCS™', badgeColor: 'bg-red-100 text-red-950 border border-red-400 font-bold font-bold' },
    { name: 'Flamingo Luxury', href: '/flamingo', icon: SparklesIcon, badge: '19+ Store', badgeColor: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold' },
    { name: 'Lush-Pressies', href: '/lush-pressies', icon: HeartIcon, badge: 'VIP Bonds', badgeColor: 'bg-pink-100 text-pink-800 font-bold' },
    { name: 'BeatWaveNg', href: '/beatwave-ng', icon: MusicalNoteIcon, badge: 'Beats', badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold' },
    { name: 'Dancia-4Tv', href: '/dancia-tv', icon: TvIcon, badge: '4K TV', badgeColor: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' },
    { name: 'Corporate Offices', href: '/business', icon: BuildingOfficeIcon, badge: 'HQ', badgeColor: 'bg-slate-200 text-slate-800' },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon, badge: 'Store', badgeColor: 'bg-orange-100 text-orange-800' },
    { name: 'Plushies Gifts', href: '/gifts', icon: GiftIcon, badge: 'Plushies', badgeColor: 'bg-teal-100 text-teal-800' },
    { name: 'Chat & Audio', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Blogs & Articles', href: '/blogs', icon: DocumentTextIcon },
    { name: 'Hallmarks', href: '/hallmarks', icon: StarIcon, badge: 'VIP', badgeColor: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' },
    { name: 'Canary Radar', href: '/canary', icon: GlobeAltIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
  ];

  return (
    <aside className="w-full space-y-4 pb-8">
      {/* 1. Main Profile Card (Matches Lushpressies) */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs overflow-hidden">
        {/* Cover Image with Radiating Pulse */}
        <div className="h-24 bg-gradient-to-r from-emerald-600 via-teal-700 to-[#DC582A] relative">
          {isRadiating && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold tracking-wide border border-emerald-400/30 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Radiating Active
            </div>
          )}
        </div>

        {/* Avatar & User Details */}
        <div className="px-5 pb-5 pt-0 -mt-10 text-center relative">
          <div className="relative inline-block">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md mx-auto ring-2 ring-emerald-500/20"
            />
            {isIncognito && (
              <span
                className="absolute bottom-0 right-0 p-1 bg-gray-800 text-white rounded-full shadow-sm"
                title="Incognito Active"
              >
                <EyeSlashIcon className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              {displayName}
            </h2>
            <VerificationBadge level={verificationLevel} size="small" />
          </div>

          <p className="text-xs text-slate-700 font-mono">@{username}</p>
          <p className="text-xs text-emerald-800 font-medium mt-1 leading-snug">
            {headline}
          </p>
          <p className="text-[11px] text-slate-700 mt-0.5">{userLocation}</p>

          {/* Membership & Consent Pill */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-400 rounded-full text-xs text-emerald-950   font-black">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span>Consent Verified</span>
            <span className="font-mono font-semibold text-emerald-700 ml-1">
              PIN: ••91
            </span>
          </div>

          {/* Protocol Status Indicator */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-gray-600">
            <span className="text-slate-700">Security Grid:</span>
            <span className="font-semibold text-emerald-950 bg-emerald-50/70 px-2.5 py-0.5 rounded-full border border-emerald-400   font-black">
              STERCS™ Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Gamification & FIC Protocol Coins Card (Matches Lushpressies) */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-[#DC582A]" />
            Protocol Rewards
          </span>
          <span className="text-[11px] font-semibold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-full border  border-emerald-400 font-black">
            Level 5
          </span>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-700 mb-1">
            <span>XP Progress</span>
            <span>850 / 1000 XP</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border text-gray-950 border-gray-400 font-black">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#DC582A] rounded-full transition-all duration-500 w-[85%]"
            />
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#F5F9F6] border border-emerald-100 rounded-xl p-2.5 text-center">
            <div className="text-base font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
              <img src="/assets/logos/fic_logo.png" alt="Infinite Coin" className="w-4 h-4 object-contain inline-block shrink-0" />
              {ficBalance.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider mt-0.5 font-medium">
              Infinite Coins
            </div>
          </div>

          <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5 text-center">
            <div className="text-base font-extrabold text-[#DC582A] flex items-center justify-center gap-1">
              <FireIcon className="w-4 h-4" />
              14 Days
            </div>
            <div className="text-[10px] text-slate-700 uppercase tracking-wider mt-0.5 font-medium">
              Streak
            </div>
          </div>
        </div>

        {/* Quick Toggles: Radiate & Incognito */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setIsRadiating(!isRadiating)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              isRadiating
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <RadioIcon className="w-4 h-4" />
              Radiate Radar
            </span>
            <span className="text-[11px] font-bold">
              {isRadiating ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsIncognito(!isIncognito)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              isIncognito
                ? 'bg-gray-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <EyeSlashIcon className="w-4 h-4" />
              Sovereign Incognito
            </span>
            <span className="text-[11px] font-bold">
              {isIncognito ? 'ACTIVE' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Platform Channels & Navigation (Matches Lushpressies) */}
      <nav className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-2.5 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Platform Channels
        </div>

        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => onCloseMobile?.()}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                active
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-600'}`} />
                <span>{item.name}</span>
              </span>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-emerald-500 text-white' : item.badgeColor || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Account and Profile Quick Controls */}
        <div className="pt-2 border-t border-slate-200 space-y-1">
          {member ? (
            <>
              <Link
                to={`/profile/${member.id}`}
                onClick={() => onCloseMobile?.()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition"
              >
                <UserCircleIcon className="w-4 h-4 text-emerald-600" />
                <span>My Profile</span>
              </Link>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobile?.();
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Link
                to="/login"
                onClick={() => onCloseMobile?.()}
                className="py-1.5 px-2 text-center rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => onCloseMobile?.()}
                className="py-1.5 px-2 text-center rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default ProtocolLushDrawer;
