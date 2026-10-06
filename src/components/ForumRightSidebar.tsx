import React, { useState } from 'react';
import TrendingTopicsWidget from './widgets/TrendingTopicsWidget';
import GroupsWidget from './widgets/GroupsWidget';
import HallmarksWidget from './widgets/HallmarksWidget';
import StorefrontWidget from './widgets/StorefrontWidget';
import PhotoCreditWidget from './widgets/PhotoCreditWidget';
import { Award, Zap, TrendingUp } from 'lucide-react';

export const ForumRightSidebar: React.FC = () => {
  const [activeRightWidget, setActiveRightWidget] = useState<'trends' | 'hallmarks'>('trends');

  return (
    <div className="hidden lg:block">
      <div className="sticky top-32 space-y-4">
        {/* Widget Switcher */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-1.5">
          <div className="grid grid-cols-2 gap-1">
            {(['trends', 'hallmarks'] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setActiveRightWidget(w)}
                className={`py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
                  activeRightWidget === w
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-gray-500 hover:bg-gray-50'
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

        <GroupsWidget />
        <StorefrontWidget />
        <PhotoCreditWidget />

        {/* Platform Ad / Promo Widget Parity */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-2">
            <Zap className="w-3 h-3" /> Sponsored
          </div>
          <p className="text-xs font-black leading-snug">Boost your Forum profile with Radiate++</p>
          <p className="text-[11px] text-emerald-200 mt-1 leading-relaxed">Get 10× more profile views and be featured in Forums for 7 days.</p>
          <button
            type="button"
            className="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition-colors"
          >Activate Radiate++</button>
        </div>
      </div>
    </div>
  );
};
