/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  GiftIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import SwipeDeck from '../SwipeDeck';
import { VerificationBadge } from '../verification/VerificationBadge';
import { PinQuotaInfo } from './LushPinPackagesModal';

export interface ActiveMatchItem {
  id: string;
  name: string;
  avatar: string;
  compatibilityScore: number;
  lastMessage: string;
  isOnline: boolean;
  hasUnread: boolean;
  pinExchanged: boolean;
  bio?: string;
  headline?: string;
  location?: string;
  intentTag?: string;
}

interface LushDiscoverySidebarProps {
  userId: number;
  matches: ActiveMatchItem[];
  pinQuota?: PinQuotaInfo;
  onOpenCatalog: () => void;
  onOpenLapidaireModal: () => void;
  onOpenChat: (_matchId: string) => void;
  onStartVideoCall: (_matchId: string) => void;
  onReverseSwipe?: () => void;
  onOpenCommitTracker?: (_matchId: string) => void;
  onOpenPinPackages?: () => void;
  onOpenMemberProfile?: (_match: ActiveMatchItem) => void;
  onRevokePin?: (_matchId: string) => void;
  onExchangePin?: (_matchId: string) => void;
}

export const LushDiscoverySidebar: React.FC<LushDiscoverySidebarProps> = ({
  userId,
  matches,
  pinQuota,
  onOpenCatalog,
  onOpenLapidaireModal,
  onOpenChat,
  onStartVideoCall,
  onReverseSwipe,
  onOpenCommitTracker,
  onOpenPinPackages,
  onOpenMemberProfile,
  onRevokePin,
  onExchangePin,
}) => {
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);

  const featuredPlushies = [
    {
      id: 'plush_01',
      name: 'Chinchilla Luxury Throw',
      price: 240,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300',
    },
    {
      id: 'plush_02',
      name: 'Lush Velvet Cloud Robe',
      price: 180,
      image:
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300',
    },
  ];

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyAnswer.trim()) return;
    setHasAnsweredToday(true);
    setDailyAnswer('');
  };

  return (
    <aside className="space-y-4">
      {/* 1. Swipe Deck Widget */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Discovery Deck
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {onReverseSwipe && (
            <button
              onClick={onReverseSwipe}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition"
              title="Reverse Roll / Rewind Last Swipe"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" />
              <span>Rewind</span>
            </button>
          )}
        </div>

        {/* Embedded Swipe Deck Component */}
        <div className="min-h-[380px] flex items-center justify-center">
          <SwipeDeck userId={userId} compact={true} />
        </div>
      </div>

      {/* 2.Lapidaire Spotlight Card (Daily 30-Question Prompt) */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
            Daily Question
          </span>
          <span className="text-[10px] font-bold text-orange-950 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-400 font-black">
            +50 Coins
          </span>
        </div>

        <div className="p-3 bg-[#F5F9F6] border border-emerald-200/80 rounded-xl">
          <p className="text-xs font-bold text-emerald-900 leading-snug">
            "What core values guide your major decisions in relationships?"
          </p>
        </div>

        {hasAnsweredToday ? (
          <div className="p-2.5 bg-emerald-50 rounded-xl text-center text-xs font-semibold text-emerald-800">
            ✅ Answer shared! Your match compatibility boosted.
          </div>
        ) : (
          <form onSubmit={handleAnswerSubmit} className="space-y-2">
            <input
              type="text"
              value={dailyAnswer}
              onChange={(e) => setDailyAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs font-bold border-slate-300 focus:ring-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!dailyAnswer.trim()}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
              >
                Submit Answer
              </button>
              <button
                type="button"
                onClick={onOpenLapidaireModal}
                className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold font-semibold rounded-xl text-xs transition"
                title="Browse all 30 Questions"
              >
                All 30
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Lush Plushies Luxury Gift Shop Card */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <GiftIcon className="w-4 h-4 text-[#DC582A]" />
            Lush Plushies Shop
          </span>
          <button
            onClick={onOpenCatalog}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
          >
            <ShoppingBagIcon className="w-3.5 h-3.5" />
            Catalog
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {featuredPlushies.map((plush) => (
            <div
              key={plush.id}
              onClick={onOpenCatalog}
              className="group cursor-pointer bg-[#F5F9F6] border border-emerald-100 rounded-xl p-2 transition hover:border-emerald-300 hover:shadow-xs"
            >
              <img
                src={plush.image}
                alt={plush.name}
                className="w-full h-20 rounded-lg object-cover mb-1.5 group-hover:scale-102 transition duration-300"
              />
              <p className="text-[11px] font-bold text-gray-900 truncate">
                {plush.name}
              </p>
              <p className="text-[10px] font-extrabold text-[#DC582A]">
                {plush.price} FIC
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Matches & 6-Digit PIN Exchange Section */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
            Mutual Matches
          </span>
          <span className="text-[11px] font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-full border  border-emerald-400 font-black">
            {matches.length} Active
          </span>
        </div>

        {/* 6-Digit PIN Quota Bar */}
        {pinQuota && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 text-xs">
            <div className="flex items-center gap-1.5">
              <KeyIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-950">PIN Quota: </span>
                <span className="font-bold font-mono text-emerald-700">
                  {pinQuota.isUnlimited
                    ? '∞ Unlimited'
                    : `${pinQuota.generationsRemaining}/${pinQuota.totalAllocated}`}
                </span>
                <span className="text-[10px] text-gray-500 ml-1">Left</span>
              </div>
            </div>
            {onOpenPinPackages && (
              <button
                type="button"
                onClick={onOpenPinPackages}
                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition shadow-2xs"
                title="Purchase PIN Packages"
              >
                + Buy PINs
              </button>
            )}
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-700 italic">
            Swipe right on matches to start conversations!
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`p-2.5 rounded-xl transition border ${
                  match.pinExchanged
                    ? 'border-emerald-100 hover:border-emerald-200 hover:bg-[#F5F9F6]'
                    : 'border-amber-100 bg-amber-50/30 hover:bg-amber-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => {
                      if (match.pinExchanged && onOpenMemberProfile) {
                        onOpenMemberProfile(match);
                      } else if (!match.pinExchanged && onExchangePin) {
                        onExchangePin(match.id);
                      } else {
                        onOpenChat(match.id);
                      }
                    }}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    title={
                      match.pinExchanged
                        ? 'Click to view full unlocked profile'
                        : '6-Digit PIN Exchange required to unlock profile'
                    }
                  >
                    <div className="relative shrink-0">
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className={`w-10 h-10 rounded-full object-cover border-2 ${
                          match.pinExchanged
                            ? 'border-emerald-500'
                            : 'border-amber-400 opacity-90'
                        }`}
                      />
                      {match.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {match.name}
                        </p>
                        <VerificationBadge level={4} size="small" />
                        {match.pinExchanged ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-400 ">
                            <ShieldCheckIcon className="w-2.5 h-2.5 text-emerald-600" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-950 border border-amber-400 ">
                            <LockClosedIcon className="w-2.5 h-2.5 text-amber-600" />
                            PIN Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-700 truncate mt-0.5">
                        {match.pinExchanged
                          ? match.lastMessage
                          : 'Exchange PIN to unlock full profile & direct messaging'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {match.pinExchanged ? (
                      <>
                        {onOpenCommitTracker && (
                          <button
                            onClick={() => onOpenCommitTracker(match.id)}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition"
                            title="View 5-Month Commitment Milestone"
                          >
                            <span className="text-xs">💍</span>
                          </button>
                        )}
                        <button
                          onClick={() => onStartVideoCall(match.id)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition"
                          title="Start Lush WebRTC Video Call"
                        >
                          <VideoCameraIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenChat(match.id)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition"
                          title="Send Message"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                        {onRevokePin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRevokePin(match.id);
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                            title="Revoke 6-Digit PIN (Closes Connection & Locks Profile)"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      onExchangePin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExchangePin(match.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition shadow-2xs flex items-center gap-1"
                          title="Exchange 6-Digit PIN to Unlock Profile"
                        >
                          <KeyIcon className="w-3 h-3" />
                          <span>Exchange PIN</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default LushDiscoverySidebar;
