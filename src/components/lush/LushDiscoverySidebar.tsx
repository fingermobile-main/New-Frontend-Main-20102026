import React, { useState } from 'react';
import {
  SparklesIcon,
  GiftIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import SwipeDeck from '../SwipeDeck';
import { VerificationBadge } from '../verification/VerificationBadge';

export interface ActiveMatchItem {
  id: string;
  name: string;
  avatar: string;
  compatibilityScore: number;
  lastMessage: string;
  isOnline: boolean;
  hasUnread: boolean;
  pinExchanged: boolean;
}

interface LushDiscoverySidebarProps {
  userId: number;
  matches: ActiveMatchItem[];
  onOpenCatalog: () => void;
  onOpenIcebreakerModal: () => void;
  onOpenChat: (matchId: string) => void;
  onStartVideoCall: (matchId: string) => void;
  onReverseSwipe?: () => void;
}

export const LushDiscoverySidebar: React.FC<LushDiscoverySidebarProps> = ({
  userId,
  matches,
  onOpenCatalog,
  onOpenIcebreakerModal,
  onOpenChat,
  onStartVideoCall,
  onReverseSwipe
}) => {
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);

  const featuredPlushies = [
    {
      id: 'plush_01',
      name: 'Chinchilla Luxury Throw',
      price: 240,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300'
    },
    {
      id: 'plush_02',
      name: 'Lush Velvet Cloud Robe',
      price: 180,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300'
    }
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
        <div className="min-h-[360px] flex items-center justify-center">
          <SwipeDeck userId={userId} />
        </div>
      </div>

      {/* 2. Icebreaker Spotlight Card (Daily 30-Question Prompt) */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
            Daily Question
          </span>
          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
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
              className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs"
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
                onClick={onOpenIcebreakerModal}
                className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl text-xs transition"
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
              <p className="text-[11px] font-bold text-gray-900 truncate">{plush.name}</p>
              <p className="text-[10px] font-extrabold text-[#DC582A]">{plush.price} FIC</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Matches & Direct Chat */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
            Mutual Matches
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {matches.length} Active
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500 italic">
            Swipe right on matches to start conversations!
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F9F6] transition border border-transparent hover:border-emerald-100"
              >
                <div
                  onClick={() => onOpenChat(match.id)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={match.avatar}
                      alt={match.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                    />
                    {match.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{match.name}</p>
                      <VerificationBadge level={4} size="small" />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{match.lastMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
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
