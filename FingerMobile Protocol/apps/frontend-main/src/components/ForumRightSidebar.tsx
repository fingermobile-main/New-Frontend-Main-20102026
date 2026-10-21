import React, { useState } from 'react';
import TrendingTopicsWidget from './widgets/TrendingTopicsWidget';
import HallmarksWidget from './widgets/HallmarksWidget';
import RotatingWidgetRail from './widgets/RotatingWidgetRail';

export const ForumRightSidebar: React.FC = () => {
  const [activeRightWidget, setActiveRightWidget] = useState<'trends' | 'hallmarks'>('trends');

  return (
    <div className="hidden lg:block">
      <div className="sticky top-28 space-y-4">
        {/* Quick Switcher */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-1.5">
          <div className="grid grid-cols-2 gap-1">
            {(['trends', 'hallmarks'] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setActiveRightWidget(w)}
                className={`py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
                  activeRightWidget === w
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {w === 'trends' ? '📈 Trends' : '🏅 Hallmarks'}
              </button>
            ))}
          </div>
        </div>

        {activeRightWidget === 'trends' ? (
          <TrendingTopicsWidget />
        ) : (
          <HallmarksWidget />
        )}

        {/* Dynamic 2-Hour Rotating Widgets + Permanent Canary Ads Bottom Anchor */}
        <RotatingWidgetRail />
      </div>
    </div>
  );
};

export default ForumRightSidebar;
