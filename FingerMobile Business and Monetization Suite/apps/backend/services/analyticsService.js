/*
 * FingerMobile Protocol™ - Analytics Service
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const AnalyticsModel = require('../models/AnalyticsModel');

class AnalyticsService {
  async calculateEngagementMetrics(contentId) {
    const analytics = await AnalyticsModel.findByContentId(contentId);
    
    return {
      engagementRate: (analytics.likes + analytics.comments + analytics.shares) / analytics.views * 100,
      reach: analytics.uniqueViewers,
      retentionRate: analytics.averageWatchTime / analytics.videoLength * 100,
    };
  }

  async generateInsights(userId, timeRange) {
    const analytics = await AnalyticsModel.getUserAnalytics(userId, timeRange);
    
    // Generate insights based on trends
    const insights = {
      topPerformingContent: this.findTopPerformers(analytics),
      engagementTrends: this.calculateTrends(analytics),
      optimalPostingTimes: this.findOptimalTimes(analytics),
      audienceGrowth: this.calculateGrowth(analytics),
    };
    
    return insights;
  }

  findTopPerformers(analytics) {
    return analytics.sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5);
  }

  calculateTrends(analytics) {
    // Simple trend calculation based on engagement over time
    const sorted = analytics.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const trends = [];
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i-1];
      const curr = sorted[i];
      const trend = {
        contentId: curr.id,
        engagementChange: ((curr.engagement_rate - prev.engagement_rate) / prev.engagement_rate) * 100,
        viewsChange: ((curr.views - prev.views) / prev.views) * 100,
      };
      trends.push(trend);
    }
    
    return trends;
  }

  findOptimalTimes(analytics) {
    // Analyze posting times vs engagement
    const timeAnalysis = {};
    
    analytics.forEach(item => {
      const hour = new Date(item.created_at).getHours();
      if (!timeAnalysis[hour]) {
        timeAnalysis[hour] = { count: 0, totalEngagement: 0 };
      }
      timeAnalysis[hour].count++;
      timeAnalysis[hour].totalEngagement += item.engagement_rate;
    });
    
    // Find the hour with highest average engagement
    let bestHour = 0;
    let bestEngagement = 0;
    
    Object.entries(timeAnalysis).forEach(([hour, data]) => {
      const avgEngagement = data.totalEngagement / data.count;
      if (avgEngagement > bestEngagement) {
        bestEngagement = avgEngagement;
        bestHour = parseInt(hour);
      }
    });
    
    return {
      optimalHour: bestHour,
      optimalEngagement: bestEngagement,
      timeAnalysis
    };
  }

  calculateGrowth(analytics) {
    if (analytics.length < 2) {
      return { growthRate: 0, growthDirection: 'neutral' };
    }
    
    const recent = analytics[0]; // Most recent
    const earlier = analytics[analytics.length - 1]; // Earliest
    
    const growthRate = ((recent.views - earlier.views) / earlier.views) * 100;
    const growthDirection = growthRate > 0 ? 'positive' : growthRate < 0 ? 'negative' : 'neutral';
    
    return { growthRate, growthDirection };
  }
}

module.exports = new AnalyticsService();