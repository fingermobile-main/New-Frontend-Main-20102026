/*
 * FingerMobile Protocol™ - Sovereign Discover Widget
 * Cross-Platform Channel & Ecosystem Exploration for Left Column
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Flame, Users, Gem, TrendingUp, Gift, Pin, Award, BookOpen, ArrowRight } from 'lucide-react';

export interface DiscoverChannel {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  path: string;
}

interface DiscoverWidgetProps {
  pageContext?: 'forum' | 'tribut' | 'hallmarks' | 'blogs' | 'groups' | 'gems' | 'trends' | 'lushpressies' | 'mii';
}

const ALL_DISCOVERY_CHANNELS: DiscoverChannel[] = [
  {
    id: 'ch-tribut',
    title: 'Tribut Moodboards',
    subtitle: 'Afrofuturist Visual Pinning & Boards',
    badge: '18k Pins',
    icon: <Pin className="w-4 h-4 text-purple-600" />,
    path: '/tribut'
  },
  {
    id: 'ch-hallmarks',
    title: 'Hallmarks Sovereign',
    subtitle: 'Decentralized 250k Mega-Communities',
    badge: '148k Nodes',
    icon: <Award className="w-4 h-4 text-orange-600" />,
    path: '/hallmarks'
  },
  {
    id: 'ch-blogs',
    title: 'Dispatches & Blogs',
    subtitle: 'Sovereign Editorial & Creator Articles',
    badge: '2.4k Articles',
    icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
    path: '/blogs'
  },
  {
    id: 'ch-groups',
    title: 'Digital Living Rooms',
    subtitle: 'Many-to-Many Micro-Communities',
    badge: '92 Salons',
    icon: <Users className="w-4 h-4 text-blue-600" />,
    path: '/groups'
  },
  {
    id: 'ch-gems',
    title: 'Gems & Liquidity',
    subtitle: 'Tokenized Vaults & Live WebRTC',
    badge: '4.8M FIC',
    icon: <Gem className="w-4 h-4 text-emerald-600" />,
    path: '/gems'
  },
  {
    id: 'ch-trends',
    title: 'Cultural Radar',
    subtitle: 'Entertainment, Galas & Viral Velocity',
    badge: 'Live Radar',
    icon: <TrendingUp className="w-4 h-4 text-red-600" />,
    path: '/trends'
  },
  {
    id: 'ch-lushpressies',
    title: 'Lush-Pressies Gifting',
    subtitle: '3D Animated Plushies & Lapidaires',
    badge: 'Sovereign VIP',
    icon: <Gift className="w-4 h-4 text-pink-600" />,
    path: '/lush-pressies'
  }
];

export const DiscoverWidget: React.FC<DiscoverWidgetProps> = ({ pageContext = 'forum' }) => {
  const navigate = useNavigate();

  // Exclude current page from channels list to show complementary destinations
  const channels = ALL_DISCOVERY_CHANNELS.filter(
    (c) => !c.path.includes(pageContext)
  ).slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-4 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-900 dark:bg-orange-950/60 dark:text-orange-300">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Discover
            </h3>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
              Ecosystem channels & living feeds
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-400 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800">
          Featured
        </span>
      </div>

      {/* Discovery Channels List */}
      <div className="space-y-1.5">
        {channels.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => navigate(ch.path)}
            className="w-full text-left p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-orange-300 transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                {ch.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors truncate flex items-center gap-1.5">
                  <span>{ch.title}</span>
                  <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    ({ch.badge})
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                  {ch.subtitle}
                </p>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>

      {/* Footer Link */}
      <button
        type="button"
        onClick={() => navigate('/discover')}
        className="w-full pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
      >
        <span>View Full Ecosystem Directory</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default DiscoverWidget;
