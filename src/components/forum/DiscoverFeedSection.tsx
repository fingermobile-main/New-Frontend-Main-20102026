import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  Sparkles,
  Users,
  ArrowRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

interface DiscoverFeedSectionProps {
  className?: string;
}

export const DiscoverFeedSection: React.FC<DiscoverFeedSectionProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const trendingTopics = [
    { tag: '#PhotoCredits2026', count: '14.8k posts', change: '+32%' },
    { tag: '#TactileKeycardNFC', count: '9.2k posts', change: '+18%' },
    { tag: '#EAL6SecurityEnclave', count: '7.5k posts', change: '+12%' },
    { tag: '#BeatwaveNGStudio', count: '6.1k posts', change: '+24%' },
  ];

  const featuredHallmarks = [
    {
      id: 'hm-1',
      name: 'Cryptographic Security & EAL6+ Enclave',
      members: '184,200',
      icon: '🛡️',
      category: 'Security & Protocol',
      badge: 'Mega-Hallmark'
    },
    {
      id: 'hm-2',
      name: 'Sovereign Executive Portraiture & Media',
      members: '96,400',
      icon: '📸',
      category: 'Creative Arts',
      badge: 'Contest Host'
    }
  ];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 p-4 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Discover®©℠ AI Engine
              </h3>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-300">
                <Sparkles className="w-2.5 h-2.5 text-indigo-700" />
                P2P Curated
              </span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">
              Trending topics, Hallmarks & Demand Gen Recommendations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/hallmarks')}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Trending Topics Cloud */}
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>Hot Discussions & Search Trends</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => navigate(`/forum?q=${encodeURIComponent(topic.tag)}`)}
              className="cursor-pointer p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition"
            >
              <span className="block text-xs font-bold text-indigo-700 dark:text-indigo-300 truncate">
                {topic.tag}
              </span>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-700 dark:text-slate-400 font-medium">
                <span>{topic.count}</span>
                <span className="text-emerald-700 font-bold">{topic.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Mega-Hallmarks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {featuredHallmarks.map((hm) => (
          <div
            key={hm.id}
            onClick={() => navigate('/hallmarks')}
            className="cursor-pointer p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 shadow-xs transition group"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-2xl p-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg">{hm.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-950 border border-purple-300">
                  {hm.badge}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-600 transition truncate">
                  {hm.name}
                </h4>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-700 dark:text-slate-400 font-medium">
                  <Users className="w-3 h-3 text-slate-500" />
                  <span>{hm.members} Members</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demand Gen Canary Ad Banner */}
      <div
        onClick={() => navigate('/canary-admaker')}
        className="cursor-pointer p-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between hover:brightness-110 transition shadow-xs"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold">
            Canary Demand Gen Ads: Reach users based on their choice & likes
          </span>
        </div>
        <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
          Explore Ads Studio <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default DiscoverFeedSection;
