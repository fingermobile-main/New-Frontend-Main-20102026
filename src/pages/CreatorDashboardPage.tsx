import React, { useState } from 'react';


/*
 * FingerMobile Protocol™ - Creator Dashboard Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import ContentScheduler from '../components/creator/ContentScheduler';
import EarningsTracker from '../components/creator/EarningsTracker';
import AudienceAnalytics from '../components/creator/AudienceAnalytics';
import ContentStudioLink from '../components/creator/ContentStudioLink';

const CreatorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'scheduler' | 'earnings' | 'analytics' | 'studio'
  >('scheduler');

  return (
    <div className="creator-dashboard-page min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="dashboard-header mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Creator Dashboard</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1.5">Manage your content, track earnings, and analyze your audience</p>
      </div>

      <div className="dashboard-tabs flex border-b border-slate-300 mb-8 space-x-3">
        <button
          className={`tab px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'scheduler'
              ? 'active border-b-2 border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          onClick={() => setActiveTab('scheduler')}
        >
          Content Scheduler
        </button>
        <button
          className={`tab px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'earnings'
              ? 'active border-b-2 border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings Tracker
        </button>
        <button
          className={`tab px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'active border-b-2 border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Audience Analytics
        </button>
        <button
          className={`tab px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'studio'
              ? 'active border-b-2 border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          onClick={() => setActiveTab('studio')}
        >
          Content Studio
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'scheduler' && <ContentScheduler creatorId="current-user" />}
        {activeTab === 'earnings' && <EarningsTracker creatorId="current-user" />}
        {activeTab === 'analytics' && <AudienceAnalytics creatorId="current-user" />}
        {activeTab === 'studio' && <ContentStudioLink />}
      </div>
    </div>
  );
};

export default CreatorDashboardPage;
