import React, {} from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface AdvancedAnalyticsDashboardProps {
  userId?: string;
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ userId }) => {
  const [selectedMetric, setSelectedMetric] = React.useState<'all' | 'growth' | 'revenue' | 'engagement'>('all');

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-slate-700 mt-1">Real-time ecosystem metrics & predictive insights</p>
        </div>
        <button
          onClick={() => setSelectedMetric('all')}
          className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center self-start sm:self-auto"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
          selectedMetric === 'growth' || selectedMetric === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300 opacity-60'
        }`}>
          <ChartBarIcon className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">User Growth</h3>
          <p className="text-3xl font-bold text-blue-600">+24%</p>
          <p className="text-sm text-slate-700 mt-1">vs last month</p>
        </div>
        <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
          selectedMetric === 'revenue' || selectedMetric === 'all' ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-300 opacity-60'
        }`}>
          <ArrowTrendingUpIcon className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-green-600">45.2K FIC</p>
          <p className="text-sm text-slate-700 mt-1">This quarter</p>
        </div>
        <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
          selectedMetric === 'engagement' || selectedMetric === 'all' ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-300 opacity-60'
        }`}>
          <svg className="w-8 h-8 text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Engagement</h3>
          <p className="text-3xl font-bold text-purple-600">87%</p>
          <p className="text-sm text-slate-700 mt-1">Active users</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Analytics</h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border border-slate-200">
          <p className="text-slate-700 font-medium">Advanced charts coming soon</p>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          onClick={() => setSelectedMetric('growth')}
          aria-label="Filter Growth"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            selectedMetric === 'growth' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📈</span>
          <span>Growth</span>
        </button>
        <button
          onClick={() => setSelectedMetric('revenue')}
          aria-label="Filter Revenue"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            selectedMetric === 'revenue' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">💰</span>
          <span>Revenue</span>
        </button>
        <button
          onClick={() => setSelectedMetric('engagement')}
          aria-label="Filter Engagement"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            selectedMetric === 'engagement' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">👥</span>
          <span>Engage</span>
        </button>
        <button
          onClick={() => setSelectedMetric('all')}
          aria-label="Reset All"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>All</span>
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

export default AdvancedAnalyticsDashboard;
