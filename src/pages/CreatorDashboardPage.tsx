import React, { useState } from 'react';


/*
 * FingerMobile Protocol™ - Creator Dashboard Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useNavigate } from 'react-router-dom';
import { Palette, Lock, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserRoleTier,
  isContentCreator,
  canAccessDashboard
} from '../services/platformRbac';
import ContentScheduler from '../components/creator/ContentScheduler';
import EarningsTracker from '../components/creator/EarningsTracker';
import AudienceAnalytics from '../components/creator/AudienceAnalytics';
import ContentStudioLink from '../components/creator/ContentStudioLink';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const CreatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'scheduler' | 'earnings' | 'analytics' | 'studio'
  >('scheduler');

  const tier = getUserRoleTier(user);
  const isCreator = isContentCreator(user);
  const hasAccess =
    tier === 'PRIMARY_SUPER_ADMIN' ||
    tier === 'SECONDARY_ADMIN_CFO' ||
    isCreator ||
    canAccessDashboard('/creatordashboard', user);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center border border-purple-300 dark:border-purple-800">
            <Palette className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Creator Studio Dashboard Restricted
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed font-medium">
            This dashboard is dedicated to registered <strong>Content Creators</strong>, verified UGC broadcasters, and platform executives. Standard platform members can access community forums or submit a Creator application to unlock this suite.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 mb-6 text-xs text-slate-800 dark:text-slate-200 text-left border border-slate-300 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1">
              Active Member Profile:
            </div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Name:</span> {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Guest'}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {user?.email || 'Unspecified'}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Current Role:</span> {user?.role || 'Member'}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Account Type:</span> {(user as any)?.accountType || (user as any)?.account_type || 'Standard Member'}</div>
          </div>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply for Content Creator Status</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/forum')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              Return to Community Forum Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Sovereign Platform Ownership Directive */}
      <div className="mt-8">
        <PlatformOwnershipCard />
      </div>
    </div>
  );
};

export default CreatorDashboardPage;
