import React, { useState, useEffect, useRef } from 'react';
import { CanaryAdsManager } from '../canary/CanaryAdsManager';
import { RotatingWidgetRail } from './RotatingWidgetRail';
import { SuperViWidget } from './SuperViWidget';
import { FingerLuxWidget } from './FingerLuxWidget';
import { LoansqrWidget } from './LoansqrWidget';
import PhotoCreditWidget from './PhotoCreditWidget';
import HallmarksWidget from './HallmarksWidget';
import TrendingTopicsWidget from './TrendingTopicsWidget';
import StorefrontWidget from './StorefrontWidget';

export type RightRailWidgetType =
  | 'canary_shopping'
  | 'canary_banner'
  | 'canary_native'
  | 'rotating_rail'
  | 'supervi'
  | 'fingerlux'
  | 'loansqr'
  | 'photocredit'
  | 'hallmarks'
  | 'trending'
  | 'storefront';

interface StreamItem {
  id: string;
  type: RightRailWidgetType;
  loadedAt: number;
}

const WIDGET_CYCLE: RightRailWidgetType[] = [
  'canary_shopping',
  'supervi',
  'canary_banner',
  'fingerlux',
  'loansqr',
  'canary_native',
  'photocredit',
  'hallmarks',
  'trending',
  'storefront',
];

interface PlatformWidgetsAndAdsRailProps {
  pageContext?: string;
  initialChildren?: React.ReactNode;
  className?: string;
}

export const PlatformWidgetsAndAdsRail: React.FC<PlatformWidgetsAndAdsRailProps> = ({
  pageContext = 'general',
  initialChildren,
  className = '',
}) => {
  const [streamItems, setStreamItems] = useState<StreamItem[]>([
    { id: 'init-1', type: 'canary_shopping', loadedAt: Date.now() },
    { id: 'init-2', type: 'supervi', loadedAt: Date.now() },
    { id: 'init-3', type: 'canary_banner', loadedAt: Date.now() },
    { id: 'init-4', type: 'fingerlux', loadedAt: Date.now() },
  ]);

  const cycleIndexRef = useRef(4);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const isAppendingRef = useRef(false);

  // Auto-append next widget in cycle
  const appendNextWidget = () => {
    if (isAppendingRef.current) return;
    isAppendingRef.current = true;

    const nextType = WIDGET_CYCLE[cycleIndexRef.current % WIDGET_CYCLE.length];
    cycleIndexRef.current += 1;

    setStreamItems((prev) => [
      ...prev,
      {
        id: `stream-${Date.now()}-${cycleIndexRef.current}`,
        type: nextType,
        loadedAt: Date.now(),
      },
    ]);

    setTimeout(() => {
      isAppendingRef.current = false;
    }, 400);
  };

  // 1. Periodic stream injection: every 15 seconds load more platform widgets & ads
  useEffect(() => {
    const timer = setInterval(() => {
      appendNextWidget();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // 2. Infinite scroll detection inside the rail or when scrolled
  useEffect(() => {
    if (!bottomSentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          appendNextWidget();
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    observer.observe(bottomSentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const renderWidget = (item: StreamItem) => {
    switch (item.type) {
    case 'canary_shopping':
      return (
        <div key={item.id} className="space-y-1">
          <CanaryAdsManager format="shopping_card" />
        </div>
      );
    case 'canary_banner':
      return (
        <div key={item.id} className="space-y-1">
          <CanaryAdsManager format="banner" />
        </div>
      );
    case 'canary_native':
      return (
        <div key={item.id} className="space-y-1">
          <CanaryAdsManager format="native_sponsored" />
        </div>
      );
    case 'supervi':
      return <SuperViWidget key={item.id} />;
    case 'fingerlux':
      return <FingerLuxWidget key={item.id} />;
    case 'loansqr':
      return <LoansqrWidget key={item.id} />;
    case 'photocredit':
      return <PhotoCreditWidget key={item.id} />;
    case 'hallmarks':
      return <HallmarksWidget key={item.id} />;
    case 'trending':
      return <TrendingTopicsWidget key={item.id} />;
    case 'storefront':
      return <StorefrontWidget key={item.id} />;
    default:
      return null;
    }
  };

  return (
    <div
      data-page-context={pageContext}
      className={`space-y-4 ${className}`}
      id="platform-widgets-and-canary-ads-rail"
    >
      {/* Page-Specific Top Content (e.g. Live Network Stats, Token Ticker, Quotas) */}
      {initialChildren}

      {/* Rotating 2-Hour Ecosystem Rail */}
      <RotatingWidgetRail />

      {/* Live Stream Telemetry Header */}
      <div className="bg-white rounded-2xl border border-slate-300 p-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              Live Canary & Platform Stream
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
            {streamItems.length} Loaded
          </span>
        </div>
        <p className="text-[11px] text-slate-700 mt-1">
          Continuous decentralized programmatic ad delivery, verified merchant cards & sovereign widget rotations.
        </p>
      </div>

      {/* Continuously Appended Stream of Platform Widgets & Canary Ads */}
      <div className="space-y-4">
        {streamItems.map((item) => renderWidget(item))}
      </div>

      {/* Stream Sentinel for Infinite Loading */}
      <div ref={bottomSentinelRef} className="py-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-300 text-[10px] font-bold text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
          <span>Streaming more widgets & Canary ads...</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 text-[11px] text-slate-600 font-medium space-y-2 border-t border-slate-200">
        <div className="flex flex-wrap gap-2 text-slate-700">
          <span>Sovereign Ad Engine</span>
          <span>•</span>
          <span>Zero User Tracking</span>
          <span>•</span>
          <span>WORM Verified</span>
        </div>
        <div>© 2026 FingerMobile Protocol™</div>
      </div>
    </div>
  );
};

export default PlatformWidgetsAndAdsRail;
