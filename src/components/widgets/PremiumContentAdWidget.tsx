import React from 'react';

const PremiumContentAdWidget: React.FC = () => {
  return (
    <div className="glass rounded-2xl p-5 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500 uppercase tracking-wider">
            Ad
          </span>
          <span className="text-xs font-medium text-brand-blue">Sponsored</span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          Unlock Premium Features
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Get advanced analytics, verified badge, and priority support.
        </p>

        <button className="w-full bg-brand-blue hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default PremiumContentAdWidget;
