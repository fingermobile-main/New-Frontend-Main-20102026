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
    <div className="creator-dashboard-page">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <p>Manage your content, track earnings, and analyze your audience</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
        >
          Content Scheduler
        </button>
        <button
          className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings Tracker
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Audience Analytics
        </button>
        <button
          className={`tab ${activeTab === 'studio' ? 'active' : ''}`}
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
