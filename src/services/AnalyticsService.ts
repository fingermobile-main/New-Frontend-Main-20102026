import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface AnalyticsData {
  period: string;
  metrics: {
  views: number;
  engagement: number;
  revenue: number;
  users: number;
  };
trends: {growth: number;
  change: number;
  };
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalRevenue: number;
  averageSessionTime: number;
  retentionRate: number;
}

class AnalyticsService {
  private api = axios.create({baseURL: `${API_BASE_URL}/`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    const response = await this.api.get('/platform');
    return response.data;
  }

  async getUserAnalytics(userId: string, period: string = '30d'): Promise<AnalyticsData> {
    const response = await this.api.get(`/user/${userId}`, { params: { period } });
    return response.data;
  }

  async getContentAnalytics(contentId: string, contentType: string): Promise<AnalyticsData> {
    const response = await this.api.get(`/content/${contentId}`, { params: { type: contentType } });
    return response.data;
  }

  async getRevenueAnalytics(userId: string, period: string = '30d'): Promise<{ totalRevenue: number; breakdown: {
  source: string;
  amount: number;
  percentage: number }[];
projections: {nextMonth: number;
  nextQuarter: number };
  }> {
    const response = await this.api.get(`/revenue/${userId}`, { params: { period } });
    return response.data;
  }

  async getEngagementAnalytics(userId: string, period: string = '30d'): Promise<{ totalEngagements: number; likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  }> {
    const response = await this.api.get(`/engagement/${userId}`, { params: { period } });
    return response.data;
  }

  async getAudienceInsights(userId: string): Promise<{ demographics: any; locations: any;
  devices: any;
  behaviorPatterns: any;
  }> {
    const response = await this.api.get(`/audience/${userId}`);
    return response.data;
  }

  async getRealTimeMetrics(): Promise<{ activeUsers: number; currentTransactions: number;
  serverLoad: number;
  responseTime: number;
  }> {
    const response = await this.api.get('/realtime');
    return response.data;
  }

  async getCustomReport(userId: string,
startDate: string, endDate: string, metrics: string[]): Promise<Blob> {
    const response = await this.api.post(`/report/${userId}`, {
      startDate,
      endDate,
      metrics
    }, {responseType: 'blob'
    });
    return response.data;
  }

  async getComparisonAnalytics(userId: string, currentPeriod: string, previousPeriod: string): Promise<{ current: AnalyticsData; previous: AnalyticsData;
  changes: {
  metric: string;
  change: number;
  direction: 'up' | 'down' }[];
  }> {
    const response = await this.api.get(`/comparison/${userId}`, { params: { currentPeriod,
  previousPeriod }
    });
    return response.data;
  }

  async trackEvent(eventName: string, eventData: unknown): Promise<void> {
    await this.api.post('/events', { eventName, eventData });
  }

  async getFunnelAnalysis(funnelName: string): Promise<{steps: {
  name: string;
  count: number;
  conversionRate: number }[];
dropoffPoints: string[];
overallConversionRate: number;
  }> {
    const response = await this.api.get(`/funnel/${funnelName}`);
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
