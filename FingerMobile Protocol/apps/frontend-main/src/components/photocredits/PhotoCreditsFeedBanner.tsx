import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  ArrowRight,
  Award,
  TrendingUp,
  Shuffle,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { p2pLeaderboardKpiEngine, CreatorLeaderboardEntry } from '../../services/P2PLeaderboardKpiEngine';
import { p2pUgcStorageService } from '../../services/P2PUgcStorageService';

interface PhotoCreditsFeedBannerProps {
  className?: string;
}

export const PhotoCreditsFeedBanner: React.FC<PhotoCreditsFeedBannerProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<CreatorLeaderboardEntry[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  useEffect(() => {
    // Initial fetch from P2P Leaderboard & KPI Engine
    setCreators(p2pLeaderboardKpiEngine.getCreators());
    setCountdown(p2pLeaderboardKpiEngine.getKpiMetrics().countdownSeconds);

    // Subscribe to real-time 10s P2P random shuffling engine
    const unsubscribe = p2pLeaderboardKpiEngine.subscribe(() => {
      setCreators([...p2pLeaderboardKpiEngine.getCreators()]);
      setCountdown(p2pLeaderboardKpiEngine.getKpiMetrics().countdownSeconds);
    });

    return unsubscribe;
  }, []);

  // Micro-rotation for thumbnail highlight
  useEffect(() => {
    if (creators.length === 0) return;
    const interval = setInterval(() => {
      setActiveThumbIndex((prev) => (prev + 1) % Math.min(creators.length, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [creators]);

  const topCreator = creators[0] || {
    creatorName: 'Israel Obinna Mbah',
    badge: '🥇 Protocol Leader',
    ficYield: 52400,
    aiQualityScore: 98,
    topMediaUrl: '/assets/branding/mbah_israel_obinna.jpeg'
  };

  const currentHighlight = creators[activeThumbIndex] || topCreator;

  return (
    <div
      role="banner"
      onClick={() => navigate('/photocredits')}
      className={`relative cursor-pointer rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border-2 border-amber-400 p-4 shadow-md transition-all hover:shadow-xl hover:border-amber-500 group overflow-hidden ${className}`}
    >
      {/* Dynamic Background Watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Camera className="w-48 h-48 text-amber-900" />
      </div>

      {/* Top Protocol Status Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400">
            <Sparkles className="w-3 h-3 text-amber-700" />
            Canary Ads Verified
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            80/20 Creator Royalty
          </span>
        </div>

        {/* 10s P2P Random Shuffling Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold shadow-xs">
          <Shuffle className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>P2P KPI Shuffle: <strong className="text-amber-400">{countdown}s</strong></span>
        </div>
      </div>

      {/* Main Content Rail */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Headline & Action (7 cols) */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider">
              PhotoCredits™
            </span>
            <span className="text-xs font-bold text-slate-800">
              Decentralized Media Licensing
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-amber-700 transition">
            Check out the latest Photo Credits! 📸✨
          </h3>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Explore 4K executive portraiture, drone cinematography, and sovereign UGC. Shuffled randomly by our P2P Leadership Board & KPI Metrics.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white/80 px-2.5 py-1 rounded-xl border border-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Contest Pool: <strong className="text-slate-900">125,000 FIC</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white/80 px-2.5 py-1 rounded-xl border border-slate-300">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>Yield: <strong className="text-emerald-950">+{topCreator.ficYield.toLocaleString()} FIC</strong></span>
            </div>
          </div>
        </div>

        {/* Right Thumbnail & Live Showcase (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-end justify-center">
          {/* Active Highlight Thumbnail */}
          <div className="relative w-full sm:w-64 h-32 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-900 mb-2">
            <img
              src={currentHighlight.topMediaUrl}
              alt={currentHighlight.creatorName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                {currentHighlight.badge}
              </span>
              <div className="flex items-center justify-between text-white text-xs font-bold">
                <span className="truncate">{currentHighlight.creatorName}</span>
                <span className="text-[10px] bg-emerald-500/80 px-1.5 py-0.5 rounded text-white font-mono">
                  {currentHighlight.aiQualityScore}% AI
                </span>
              </div>
            </div>
          </div>

          {/* Mini Shuffling Thumbnail Carousel Row */}
          <div className="flex items-center gap-1.5">
            {creators.slice(0, 5).map((c, i) => (
              <div
                key={c.creatorId}
                className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                  i === activeThumbIndex ? 'border-2 border-amber-600 scale-110 shadow-sm' : 'border-slate-300 opacity-70'
                }`}
              >
                <img src={c.topMediaUrl} alt={c.creatorName} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="flex items-center gap-1 text-xs font-black text-amber-800 ml-1 group-hover:translate-x-1 transition-transform">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCreditsFeedBanner;
