import React, { useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface AnalyticsDashboardProps {
  userId?: string;
  period?: 'day' | 'week' | 'month';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, period = 'week' }) => {
  const [metrics, setMetrics] = React.useState({
    views: 12500,
    engagement: 8.5,
    followers: 1250,
    revenue: 3500
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-6 h-6 text-blue-500" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.views.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />
            <span className="text-xs text-green-600 font-medium">+5%</span>
          </div>
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.engagement}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-sm text-gray-600">Followers</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.followers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-green-600 font-medium">+15%</span>
          </div>
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.revenue.toLocaleString()} FIC</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <p className="text-slate-700 font-medium">Analytics chart visualization coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
