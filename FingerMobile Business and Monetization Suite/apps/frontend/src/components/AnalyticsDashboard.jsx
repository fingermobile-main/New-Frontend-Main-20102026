/* eslint-disable */
/*
 * FingerMobile Protocol™ - Analytics Dashboard Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';

const AnalyticsDashboard = ({ userId }) => {
  const [publishedUGC, setPublishedUGC] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getPublishedUGC(userId);
        if (response.success) {
          setPublishedUGC(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Published UGC Analytics</h2>
      <div className="metrics-grid">
        {publishedUGC.map(item => (
          <div key={item.id} className="metric-card">
            <h3>{item.title}</h3>
            <div className="metric-row">
              <span>Views: {item.views}</span>
              <span>Unique Viewers: {item.unique_viewers}</span>
            </div>
            <div className="metric-row">
              <span>Engagement Rate: {item.engagement_rate}%</span>
              <span>Net Follows: {item.net_follows}</span>
            </div>
            <div className="metric-row">
              <span>Comments: {item.comments_count}</span>
              <span>Watch Time: {item.watch_time_seconds}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;