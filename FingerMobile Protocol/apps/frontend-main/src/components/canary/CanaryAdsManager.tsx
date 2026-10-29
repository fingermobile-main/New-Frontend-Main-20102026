/**
 * FingerMobile Protocol™ - Canary Ads Manager
 * Comprehensive Multi-Campaign & Multi-Format Decentralized Ad Engine.
 *
 * Supported Campaign Types:
 * 1. Search Ads
 * 2. Display Ads
 * 3. Shopping Ads (Product cards with photo, FIC price, store name)
 * 4. Video Ads (with 12-second UGC play pause logic: pauses UGC after 12s to play bumper video < 6s)
 * 5. Demand Gen Ads (Visually driven for social/discovery surfaces)
 * 6. Canary Ads Max (Canary Max) (All-in-one AI-driven delivery)
 * 7. App Ads (App installs & deep links)
 * 8. Local Services Ads (LSAs) (Local brick-and-mortar with Guarantee)
 * 9. Smart Campaigns (Automated SMB goals)
 *
 * Formats:
 * - In-Stream (Skippable after 5s, Non-Skippable 15-30s, Bumper 6s)
 * - Display & Banner (Banner, Anchor/Overlay, Interstitials)
 * - Search & Discovery (Paid Search, Masthead)
 * - Specialized & Native (Shorts/Vertical Video, Native Sponsored, Retargeting, Rewarded Video, App Open)
 *
 * Critical Rule:
 * Excludes AboutUs, Legal screens/pages etc.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Clock,
  Coins
} from 'lucide-react';

export type CanaryCampaignType =
  | 'search'
  | 'display'
  | 'shopping'
  | 'video'
  | 'demand_gen'
  | 'canary_max'
  | 'app'
  | 'local_services'
  | 'smart'
  | 'interstitial';

export type CanaryFormatType =
  | 'banner'
  | 'anchor_overlay'
  | 'interstitial'
  | 'shopping_card'
  | 'native_sponsored'
  | 'bumper_video'
  | 'rewarded_video';

interface CanaryAdsManagerProps {
  campaignType?: CanaryCampaignType;
  format?: CanaryFormatType;
  className?: string;
  onAdClose?: () => void;
  // Video Ad 12s Pause Props
  ugcPlayingSeconds?: number;
  onPauseUgcForBumper?: () => void;
  onResumeUgcAfterBumper?: () => void;
}

// Routes strictly excluded from Canary Ads delivery per protocol specification
const EXCLUDED_ROUTES = [
  '/about',
  '/about-us',
  '/legal',
  '/terms',
  '/privacy',
  '/compliance',
  '/cookie-policy',
  '/disclaimer'
];

export const CanaryAdsManager: React.FC<CanaryAdsManagerProps> = ({
  campaignType = 'display',
  format = 'banner',
  className = '',
  onAdClose,
  ugcPlayingSeconds = 0,
  onPauseUgcForBumper,
  onResumeUgcAfterBumper
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bumperCountdown, setBumperCountdown] = useState(6);
  const [isPlayingBumper, setIsPlayingBumper] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [liveAd, setLiveAd] = useState<{
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    targetUrl?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/advertisements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ads && data.ads.length > 0) {
          setLiveAd(data.ads[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Check if current route is an excluded route
  const isExcludedRoute = EXCLUDED_ROUTES.some((route) =>
    location.pathname.toLowerCase().startsWith(route)
  );

  // Video Ads 12-second UGC Pause Logic:
  // Usually it pauses any UGC after 12 seconds of play time to play any of the platform's
  // own Video Ads that is below 6 seconds.
  useEffect(() => {
    if (ugcPlayingSeconds >= 12 && !isPlayingBumper && !isDismissed) {
      if (onPauseUgcForBumper) onPauseUgcForBumper();
      setIsPlayingBumper(true);
      setBumperCountdown(6);

      const interval = setInterval(() => {
        setBumperCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlayingBumper(false);
            if (onResumeUgcAfterBumper) onResumeUgcAfterBumper();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ugcPlayingSeconds, isPlayingBumper, isDismissed, onPauseUgcForBumper, onResumeUgcAfterBumper]);

  // If on an excluded route, do not render any ads
  if (isExcludedRoute || isDismissed) {
    return null;
  }

  // 1. In-Stream 6-Second Bumper Video Ad Overlay
  if (isPlayingBumper) {
    return (
      <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden border-2 border-amber-400 p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-400">
              <Sparkles className="w-3 h-3" />
              Canary™ 6s Bumper Ad
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-300">
              Resuming UGC in <strong className="text-amber-400">{bumperCountdown}s</strong>
            </span>
          </div>

          <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 mb-3 flex items-center justify-center">
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-in-the-forest-41133-large.mp4"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white">
              Sponsored • Canary Video Network
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">Upgrade to Protocol Premium</h4>
              <p className="text-[10px] text-slate-400">Zero interruption on all UGC streams</p>
            </div>
            <button
              onClick={() => {
                setIsPlayingBumper(false);
                if (onResumeUgcAfterBumper) onResumeUgcAfterBumper();
              }}
              className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:brightness-110"
            >
              Skip ({bumperCountdown}s)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Shopping Ads Format (Product listings with photo, price, store name)
  if (format === 'shopping_card') {
    return (
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition ${className}`}>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-black text-slate-900 dark:text-white">
              Canary Shopping Ads
            </span>
          </div>
          <span className="text-[9px] font-bold text-amber-950 bg-amber-100 border border-amber-400 px-1.5 py-0.5 rounded">
            Sponsored
          </span>
        </div>

        <div className="flex gap-3">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
            alt="Product"
            className="w-[88px] h-[88px] rounded-xl object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              Tactile Cryptographic Keycard Hardware (EAL6+)
            </h4>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Store: <strong className="text-slate-900 dark:text-white">FingerMobile Sovereign Gear</strong>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                <Coins className="w-3.5 h-3.5" /> 120 FIC
              </span>
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold transition ml-auto"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Anchor / Overlay Ad (Fixed at bottom of screen with close button)
  if (format === 'anchor_overlay') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 text-white border-t-2 border-amber-400 p-2.5 shadow-2xl backdrop-blur-sm flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
            Canary Max™
          </span>
          <p className="text-xs font-bold text-white hidden sm:block">
            Decentralized Media Licensing & PhotoCredits Leaderboard is Live! 📸
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/photocredits')}
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black rounded-lg hover:brightness-110"
          >
            Check Out Photo Credits →
          </button>
          <button aria-label="Close"
            type="button"
            onClick={() => {
              setIsDismissed(true);
              if (onAdClose) onAdClose();
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Default Display Ad Banner
  return (
    <div
      onClick={() => {
        if (liveAd?.targetUrl) {
          window.open(liveAd.targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          navigate('/canary-ad-maker');
        }
      }}
      className={`cursor-pointer rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-300 dark:border-amber-600/50 p-3 shadow-xs hover:shadow-md transition flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {liveAd?.title || 'Canary Ads Display Network'}
            </span>
            <span className="text-[9px] font-bold bg-amber-100 text-amber-950 border border-amber-400 px-1 py-0.2 rounded">
              Ad
            </span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
            {liveAd?.description || 'Sovereign programmatic reach across screens & pages'}
          </p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
    </div>
  );
};

export default CanaryAdsManager;
