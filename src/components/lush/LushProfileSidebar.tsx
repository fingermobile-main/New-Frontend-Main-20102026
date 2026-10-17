/* eslint-disable no-unused-vars */
import React from 'react';
import {
  SparklesIcon,
  FireIcon,
  ShieldCheckIcon,
  RadioIcon,
  AdjustmentsHorizontalIcon,
  EyeSlashIcon,
  LockClosedIcon,
  HeartIcon,
  GiftIcon,
  ChatBubbleLeftEllipsisIcon,
  HashtagIcon,
  StarIcon,
  Square2StackIcon,
  ChartBarIcon,
  TrophyIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { VerificationBadge } from '../verification/VerificationBadge';
import { PinQuotaInfo } from './LushPinPackagesModal';

export interface LushUserProfile {
  id: string;
  name: string;
  username: string;
  headline: string;
  bio?: string;
  location: string;
  avatar: string;
  coverImage?: string;
  verificationLevel: number;
  lushCoins: number;
  streakDays: number;
  level: number;
  xpCurrent: number;
  xpMax: number;
  matchingIntent: string;
  isIncognito: boolean;
  pinNumber?: string;
  isRadiating: boolean;
}

interface LushProfileSidebarProps {
  user: LushUserProfile;
  activeFeedTab: string;
  pinQuota?: PinQuotaInfo;
  onSelectFeedTab: (_tab: string) => void;
  onToggleIncognito: () => void;
  onToggleRadiate: () => void;
  onOpenPreferences: () => void;
  onOpenPinModal: () => void;
  onOpenGamification?: () => void;
  onOpenHeatmap?: () => void;
  onOpenCommitTracker?: () => void;
  onOpenEditProfile?: () => void;
  onOpenPinPackages?: () => void;
}

export const LushProfileSidebar: React.FC<LushProfileSidebarProps> = ({
  user,
  activeFeedTab,
  pinQuota,
  onSelectFeedTab,
  onToggleIncognito,
  onToggleRadiate,
  onOpenPreferences,
  onOpenPinModal,
  onOpenGamification,
  onOpenHeatmap,
  onOpenCommitTracker,
  onOpenEditProfile,
  onOpenPinPackages,
}) => {
  const xpPercent = Math.min(
    100,
    Math.round((user.xpCurrent / user.xpMax) * 100)
  );

  return (
    <aside className="space-y-4">
      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs overflow-hidden">
        {/* Cover Image */}
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
          {user.isRadiating && (
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
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md mx-auto"
            />
            {user.isIncognito && (
              <span
                className="absolute bottom-0 right-0 p-1 bg-gray-800 text-white rounded-full shadow-sm"
                title="Incognito Active"
              >
                <EyeSlashIcon className="w-3.5 h-3.5" />
              </span>
            )}
            {onOpenEditProfile && (
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="absolute top-0 right-0 p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-sm transition"
                title="Edit Profile & Bio"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              {user.name}
            </h2>
            <VerificationBadge level={user.verificationLevel} size="small" />
          </div>

          <p className="text-xs text-slate-700 font-mono">@{user.username}</p>
          <p className="text-xs text-emerald-800 font-medium mt-1">
            {user.headline}
          </p>
          <p className="text-[11px] text-slate-700 mt-0.5">{user.location}</p>

          {/* Edit Profile Action Button */}
          {onOpenEditProfile && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 transition shadow-2xs text-emerald-950 border-emerald-400 font-black"
                title="Edit Bio, Headline, Avatars & Banners"
              >
                <PencilSquareIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}

          {/* Membership & PIN Pill */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-400 rounded-full text-xs text-emerald-950 text-emerald-950 border-emerald-400 font-black">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span>Consent Verified</span>
            <button
              onClick={onOpenPinModal}
              className="font-mono font-semibold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 ml-1"
              title="Click to view or change PIN"
            >
              <LockClosedIcon className="w-3 h-3" />
              PIN:{' '}
              {user.pinNumber ? `••••${user.pinNumber.slice(-2)}` : 'Active'}
            </button>
          </div>

          {/* 6-Digit PIN Generation Quota Indicator */}
          {pinQuota && (
            <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 bg-[#F5F9F6] border border-emerald-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="font-semibold text-emerald-900">PIN Quota:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {pinQuota.isUnlimited
                    ? '∞ Unlimited'
                    : `${pinQuota.generationsRemaining}/${pinQuota.totalAllocated}`}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Left</span>
              </div>
              {onOpenPinPackages && (
                <button
                  type="button"
                  onClick={onOpenPinPackages}
                  className="text-[11px] font-bold text-[#DC582A] hover:text-orange-700 hover:underline transition"
                  title="Purchase PIN Packages"
                >
                  + Packages
                </button>
              )}
            </div>
          )}

          {/* Matching Intent Tag */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-gray-600">
            <span className="text-slate-700">Matching Intent:</span>
            <span className="font-semibold text-emerald-950 bg-emerald-50/70 px-2.5 py-0.5 rounded-full border border-emerald-400 text-emerald-950 border-emerald-400 font-black">
              {user.matchingIntent}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Gamification & Lush Coins Card */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-[#DC582A]" />
            Lush Rewards
          </span>
          <span className="text-[11px] font-semibold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-full border text-emerald-950 border-emerald-400 font-black">
            Level {user.level}
          </span>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-700 mb-1">
            <span>XP Progress</span>
            <span>
              {user.xpCurrent} / {user.xpMax} XP
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#DC582A] rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#F5F9F6] border border-emerald-100 rounded-xl p-2.5 text-center">
            <div className="text-base font-extrabold text-emerald-800 flex items-center justify-center gap-1">
              <span>🪙</span>
              {user.lushCoins.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5 font-medium">
              Lush Coins
            </div>
          </div>

          <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5 text-center">
            <div className="text-base font-extrabold text-[#DC582A] flex items-center justify-center gap-1">
              <FireIcon className="w-4 h-4" />
              {user.streakDays} Days
            </div>
            <div className="text-[10px] text-slate-700 uppercase tracking-wider mt-0.5 font-medium">
              Streak
            </div>
          </div>
        </div>

        {onOpenGamification && (
          <button
            onClick={onOpenGamification}
            className="w-full py-1.5 px-3 rounded-xl text-[11px] font-bold text-[#DC582A] bg-orange-50 hover:bg-orange-100/80 border border-orange-200/60 flex items-center justify-center gap-1.5 transition"
          >
            <TrophyIcon className="w-3.5 h-3.5" />
            <span>View Badges & Leaderboard</span>
          </button>
        )}

        {/* Quick Toggles: Radiate & Incognito */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <button
            onClick={onToggleRadiate}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              user.isRadiating
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <RadioIcon className="w-4 h-4" />
              Radiate Radar
            </span>
            <span className="text-[11px] font-bold">
              {user.isRadiating ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={onToggleIncognito}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              user.isIncognito
                ? 'bg-gray-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <EyeSlashIcon className="w-4 h-4" />
              Sovereign Incognito
            </span>
            <span className="text-[11px] font-bold">
              {user.isIncognito ? 'ACTIVE' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Feed Navigation & Filter Channels */}
      <nav className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-2.5 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Feed Channels
        </div>

        <button
          onClick={() => onSelectFeedTab('feed')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'feed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <HeartIcon className="w-4 h-4" />
            Lush-Pressies Feed
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeFeedTab === 'feed'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Live
          </span>
        </button>

        <button
          onClick={() => onSelectFeedTab('encore')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'encore'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-xs'
              : 'text-amber-950 bg-amber-50/60 hover:bg-amber-100 hover:text-amber-950 border border-amber-200/50'
          }`}
          title="Scroll 3-5 Star Members, Propose Meets & Expeditions, Send OwnIt/Flamingo Gifts"
        >
          <span className="flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-amber-500" />
            Encore™ (3–5★)
          </span>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded-full font-bold border text-amber-950 border-amber-400 font-black">
            VIP Bonds
          </span>
        </button>

        <button
          onClick={() => onSelectFeedTab('discover')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'discover'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <Square2StackIcon className="w-4 h-4 text-emerald-600" />
            Discover Deck
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold px-1.5 py-0.5 rounded-full font-bold font-black">
            Swipe
          </span>
        </button>

        <button
          onClick={() => onSelectFeedTab('lapidaires')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'lapidaires' || activeFeedTab === 'lapidaires'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
            <span>Lapidaire Q&A</span>
          </span>
          <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
            30 Prompts
          </span>
        </button>

        <button
          onClick={() => onSelectFeedTab('gifts')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'gifts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <GiftIcon className="w-4 h-4" />
            Gift Exchanges
          </span>
          <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full">
            Plushies
          </span>
        </button>

        <button
          onClick={() => onSelectFeedTab('trending')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeFeedTab === 'trending'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <HashtagIcon className="w-4 h-4" />
            Trending Stories
          </span>
        </button>

        <div className="pt-2 border-t border-slate-200 space-y-1">
          {onOpenHeatmap && (
            <button
              onClick={onOpenHeatmap}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition"
            >
              <ChartBarIcon className="w-4 h-4 text-emerald-600" />
              Activity Heatmap
            </button>
          )}

          {onOpenCommitTracker && (
            <button
              onClick={onOpenCommitTracker}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition"
            >
              <TrophyIcon className="w-4 h-4 text-amber-600" />
              5-Month Commitment
            </button>
          )}

          <button
            onClick={onOpenPreferences}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-emerald-600" />
            Matching Preferences
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default LushProfileSidebar;
