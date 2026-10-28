import React, { useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface AnalyticsDashboardProps {
  userId?: string;
  period?: 'day' | 'week' | 'month';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, period: initialPeriod = 'week' }) => {
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>(initialPeriod);
  const [metrics, setMetrics] = useState({
    views: 12500,
    engagement: 8.5,
    followers: 1250,
    revenue: 3500
  });

  const refreshMetrics = () => {
    setMetrics({
      views: 13200,
      engagement: 9.1,
      followers: 1310,
      revenue: 3850
    });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-slate-700 mt-1">Key performance metrics and platform audience growth</p>
        </div>
        <div className="flex items-center gap-2">
          {(['day', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                activePeriod === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-6 h-6 text-blue-500" />
            <span className="text-xs text-green-700 font-bold">+12%</span>
          </div>
          <p className="text-sm text-slate-700">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.views.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />
            <span className="text-xs text-green-700 font-bold">+5%</span>
          </div>
          <p className="text-sm text-slate-700">Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.engagement}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs text-green-700 font-bold">+8%</span>
          </div>
          <p className="text-sm text-slate-700">Followers</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.followers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-green-700 font-bold">+15%</span>
          </div>
          <p className="text-sm text-slate-700">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.revenue.toLocaleString()} FIC</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border border-slate-200">
          <p className="text-slate-700 font-medium">Analytics chart visualization coming soon</p>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          onClick={() => setActivePeriod('day')}
          aria-label="Period Day"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activePeriod === 'day' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📅</span>
          <span>Day</span>
        </button>
        <button
          onClick={() => setActivePeriod('week')}
          aria-label="Period Week"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activePeriod === 'week' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📆</span>
          <span>Week</span>
        </button>
        <button
          onClick={() => setActivePeriod('month')}
          aria-label="Period Month"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activePeriod === 'month' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">🗓️</span>
          <span>Month</span>
        </button>
        <button
          onClick={refreshMetrics}
          aria-label="Refresh Analytics"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>Refresh</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
