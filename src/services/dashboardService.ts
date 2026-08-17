import React, {} from 'react';
import { api } from './api';
import { Member } from '../types';
import {
  SystemMetric,
  MemberActivity,
  SystemAlert,
  SecurityEvent,
  MonetizationData,
  AdCampaign,
  UGCMetric,
  ContentPerformance,
  AudienceDemographic,
  UGCActivity,
  ContentItem,
  DetailedMetric,
  AgeDistribution,
  GenderSplit,
  TopInterest,
  GeographicReach,
  MonetizationEarnings,
  ScheduledContent,
  BestPostingTime
} from '../types/dashboard';

// ==========================================
// Strongly Typed Interfaces for Generic Stats
// ==========================================
export interface MemberStats {
  total: number;
  active: number;
  newThisMonth: number;
  churnRate: number;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

export interface PlatformStats {
  totalTransactions: number;
  conversionRate: number;
  activeCampaigns: number;
}

export interface PlatformRevenue {
  gross: number;
  net: number;
  currency: string;
  growthPercentage: number;
}

export interface MemberFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SecurityEventParams {
  severity?: 'low' | 'medium' | 'high' | 'critical';
  page?: number;
  limit?: number;
}

export interface AdCampaignParams {
  status?: 'active' | 'paused' | 'completed';
  search?: string;
}

export interface ContentFilterParams {
  type?: 'post' | 'video' | 'document';
  search?: string;
}

// ==========================================
// Core Dashboard Service Class
// ==========================================
export class DashboardService {
  
  // ----------------------------------------
  // Super Admin Dashboard API Functions
  // ----------------------------------------
  
  async getAdminDashboardData(timeRange: string): Promise<SystemMetric[]> {
    try {
      const response = await api.get<SystemMetric[]>('/admin/dashboard/metrics', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      return [
        { name: 'Total Members', value: '2,842,901', change: 12.5, icon: 'MembersIcon', color: 'bg-blue-500' },
        { name: 'Active Sessions', value: '142,832', change: 8.3, icon: 'BellIcon', color: 'bg-green-500' },
        { name: 'Total Revenue', value: '₦42.8M', change: 15.2, icon: 'CurrencyDollarIcon', color: 'bg-yellow-500' },
        { name: 'Content Posts', value: '12.4M', change: 5.7, icon: 'DocumentTextIcon', color: 'bg-purple-500' }
      ];
    }
  }

  async getMemberStats(): Promise<MemberStats> {
    try {
      const response = await api.get<MemberStats>('/admin/members/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching member stats:', error);
      return { total: 0, active: 0, newThisMonth: 0, churnRate: 0 };
    }
  }

  async getMemberActivities(timeRange: string): Promise<MemberActivity[]> {
    try {
      const response = await api.get<MemberActivity[]>('/admin/dashboard/activities', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching member activities:', error);
      return [
        { id: '1', member: 'Alex Johnson', action: 'Created new post', timestamp: '2 mins ago', ip: '192.168.1.105', location: 'Lagos, Nigeria' },
        { id: '2', member: 'Maria Garcia', action: 'Purchased premium subscription', timestamp: '15 mins ago', ip: '2001:db8::1', location: 'Madrid, Spain' },
        { id: '3', member: 'David Chen', action: 'Uploaded video content', timestamp: '32 mins ago', ip: '10.0.0.23', location: 'Beijing, China' },
        { id: '4', member: 'Sarah Williams', action: 'Joined community group', timestamp: '1 hour ago', ip: '172.16.0.45', location: 'London, UK' }
      ];
    }
  }

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await api.get<SystemStatus>('/admin/system/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      return { status: 'degraded', cpuUsage: 0, memoryUsage: 0, uptime: '0h' };
    }
  }

  async getSystemAlerts(timeRange: string): Promise<SystemAlert[]> {
    try {
      const response = await api.get<SystemAlert[]>('/admin/dashboard/alerts', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      return [
        { id: '1', title: 'High CPU Usage', description: 'Server CPU usage at 92% for last 15 minutes', severity: 'high', timestamp: '10:32 AM', resolved: false },
        { id: '2', title: 'New Feature Deployment', description: 'Voice chat feature deployed successfully', severity: 'low', timestamp: '09:15 AM', resolved: true },
        { id: '3', title: 'Security Alert', description: 'Multiple failed login attempts detected', severity: 'medium', timestamp: '08:47 AM', resolved: false }
      ];
    }
  }

  async getMembers(params: MemberFilterParams = {}): Promise<{ members: Member[] }> {
    try {
      const response = await api.get<{ members: Member[] }>('/admin/members', { params });
      return response.data || { members: [] };
    } catch (error) {
      console.error('Error fetching members:', error);
      return { members: [] };
    }
  }

  async getSecurityEvents(params: SecurityEventParams = {}): Promise<{ events: SecurityEvent[] }> {
    try {
      const response = await api.get<{ events: SecurityEvent[] }>('/admin/security/events', { params });
      return response.data || { events: [] };
    } catch (error) {
      console.error('Error fetching security events:', error);
      return { events: [] };
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const response = await api.get<PlatformStats>('/admin/platform/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return { totalTransactions: 0, conversionRate: 0, activeCampaigns: 0 };
    }
  }

  async getPlatformRevenue(params: Record<string, string | number> = {}): Promise<PlatformRevenue> {
    try {
      const response = await api.get<PlatformRevenue>('/admin/platform/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform revenue:', error);
      return { gross: 0, net: 0, currency: 'NGN', growthPercentage: 0 };
    }
  }

  async getAdCampaigns(filters: AdCampaignParams = {}): Promise<{ campaigns: AdCampaign[] }> {
    try {
      const response = await api.get<{ campaigns: AdCampaign[] }>('/admin/ads/campaigns', { params: filters });
      return response.data || { campaigns: [] };
    } catch (error) {
      console.error('Error fetching ad campaigns:', error);
      return { campaigns: [] };
    }
  }

  // ----------------------------------------
  // UGC Dashboard API Functions
  // ----------------------------------------
  
  async getUGCMetrics(timeRange: string): Promise<UGCMetric[]> {
    try {
      const response = await api.get<UGCMetric[]>('/ugc/dashboard/metrics', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching UGC metrics:', error);
      return [
        { name: 'Total Followers', value: '124.5K', change: 8.2, icon: 'MembersIcon', color: 'bg-blue-500' },
        { name: 'Content Engagement', value: '2.4M', change: 15.7, icon: 'HeartIcon', color: 'bg-red-500' },
        { name: 'Reach', value: '8.7M', change: 12.3, icon: 'ArrowTrendingUpIcon', color: 'bg-green-500' },
        { name: 'Impressions', value: '15.2M', change: 9.8, icon: 'EyeIcon', color: 'bg-purple-500' }
      ];
    }
  }

  async getContentPerformance(): Promise<ContentPerformance[]> {
    try {
      const response = await api.get<ContentPerformance[]>('/ugc/dashboard/content-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching content performance:', error);
      return [
        { id: '1', type: 'post', title: 'Summer Adventure Photos', likes: 12400, comments: 342, shares: 876, views: 45200, engagement: 32.4, thumbnail: 'photo' },
        { id: '2', type: 'video', title: 'Cooking Tutorial: Pasta', likes: 8900, comments: 210, shares: 432, views: 125000, engagement: 8.7, thumbnail: 'video' },
        { id: '3', type: 'post', title: 'Tech Review: New Smartphone', likes: 5600, comments: 187, shares: 321, views: 28700, engagement: 25.1, thumbnail: 'document' },
        { id: '4', type: 'video', title: 'Fitness Routine Demo', likes: 15600, comments: 421, shares: 987, views: 210000, engagement: 12.3, thumbnail: 'video' }
      ];
    }
  }

  async getAudienceDemographics(): Promise<AudienceDemographic[]> {
    try {
      const response = await api.get<AudienceDemographic[]>('/ugc/dashboard/audience-demographics');
      return response.data;
    } catch (error) {
      console.error('Error fetching audience demographics:', error);
      return [
        { country: 'Nigeria', percentage: 42, members: '52.3K' },
        { country: 'India', percentage: 18, members: '22.4K' },
        { country: 'USA', percentage: 12, members: '15.0K' },
        { country: 'UK', percentage: 8, members: '10.0K' },
        { country: 'Canada', percentage: 6, members: '7.5K' },
        { country: 'Others', percentage: 14, members: '17.3K' }
      ];
    }
  }

  async getUGCActivities(): Promise<UGCActivity[]> {
    try {
      const response = await api.get<UGCActivity[]>('/ugc/dashboard/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching UGC activities:', error);
      return [
        { id: '1', member: 'You', action: 'Posted new video', content: 'Fitness Routine Demo', timestamp: '2 hours ago', type: 'video' },
        { id: '2', member: 'You', action: 'Liked a post', content: 'Travel Photography Tips', timestamp: '5 hours ago', type: 'heart' },
        { id: '3', member: 'You', action: 'Commented on', content: 'Tech News Discussion', timestamp: '1 day ago', type: 'comment' },
        { id: '4', member: 'You', action: 'Shared', content: 'Music Festival Highlights', timestamp: '2 days ago', type: 'share' }
      ];
    }
  }

  async getContentItems(filters: ContentFilterParams): Promise<ContentItem[]> {
    try {
      const response = await api.get<ContentItem[]>('/ugc/content', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching content items:', error);
      return [
        { id: '1', title: 'Summer Adventure Photos', type: 'post', createdAt: '2 days ago', likes: 12400, comments: 342 },
        { id: '2', title: 'Cooking Tutorial: Pasta', type: 'video', createdAt: '3 days ago', likes: 8900, comments: 210 },
        { id: '3', title: 'Tech Review: New Smartphone', type: 'post', createdAt: '1 week ago', likes: 5600, comments: 187 },
        { id: '4', title: 'Fitness Routine Demo', type: 'video', createdAt: '2 weeks ago', likes: 15600, comments: 421 }
      ];
    }
  }

  async getDetailedMetrics(): Promise<DetailedMetric[]> {
    try {
      const response = await api.get<DetailedMetric[]>('/ugc/dashboard/detailed-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed metrics:', error);
      return [
        { id: '1', title: 'Summer Adventure Photos', views: '45.2K', likes: '12.4K', comments: '342', shares: '876', watch: '2m 15s', rate: '32.4%' },
        { id: '2', title: 'Cooking Tutorial: Pasta', views: '125K', likes: '8.9K', comments: '210', shares: '432', watch: '8m 42s', rate: '8.7%' },
        { id: '3', title: 'Tech Review: New Smartphone', views: '28.7K', likes: '5.6K', comments: '187', shares: '321', watch: '5m 30s', rate: '25.1%' },
        { id: '4', title: 'Fitness Routine Demo', views: '210K', likes: '15.6K', comments: '421', shares: '987', watch: '12m 18s', rate: '12.3%' }
      ];
    }
  }

  async getAgeDistribution(): Promise<AgeDistribution[]> {
    try {
      const response = await api.get<AgeDistribution[]>('/ugc/dashboard/age-distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching age distribution:', error);
      return [
        { range: '18-24', percentage: 32, members: '39.8K' },
        { range: '25-34', percentage: 28, members: '34.9K' },
        { range: '35-44', percentage: 18, members: '22.4K' },
        { range: '45-54', percentage: 12, members: '14.9K' },
        { range: '55+', percentage: 10, members: '12.5K' }
      ];
    }
  }

  async getGenderSplit(): Promise<GenderSplit> {
    try {
      const response = await api.get<GenderSplit>('/ugc/dashboard/gender-split');
      return response.data;
    } catch (error) {
      console.error('Error fetching gender split:', error);
      return { male: 55, female: 45 };
    }
  }

  async getTopInterests(): Promise<TopInterest[]> {
    try {
      const response = await api.get<TopInterest[]>('/ugc/dashboard/top-interests');
      return response.data;
    } catch (error) {
      console.error('Error fetching top interests:', error);
      return [
        { interest: 'Technology', percentage: 42 },
        { interest: 'Travel', percentage: 35 },
        { interest: 'Food & Cooking', percentage: 28 },
        { interest: 'Fitness', percentage: 25 },
        { interest: 'Fashion', percentage: 18 }
      ];
    }
  }

  async getGeographicReach(): Promise<GeographicReach[]> {
    try {
      const response = await api.get('/ugc/dashboard/geographic-reach');
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic reach:', error);
      return [
        { country: 'Nigeria', percentage: 42, members: '52.3K' },
        { country: 'India', percentage: 18, members: '22.4K' },
        { country: 'USA', percentage: 12, members: '15.0K' },
        { country: 'UK', percentage: 8, members: '10.0K' },
        { country: 'Canada', percentage: 6, members: '7.5K' }
      ];
    }
  }

  async getMonetizationEarnings(timeRange: string): Promise<MonetizationEarnings> {
    try {
      const response = await api.get<MonetizationEarnings>('/ugc/monetization/earnings', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monetization earnings:', error);
      return {
        totalEarnings: '₦124.5K',
        contentRevenue: '₦89.2K',
        affiliateEarnings: '₦35.3K',
        revenueBySource: [
          { source: 'Content Monetization', percentage: 71.4, amount: '₦89.2K', color: 'bg-blue-500' },
          { source: 'Affiliate Marketing', percentage: 28.6, amount: '₦35.3K', color: 'bg-purple-500' }
        ],
        topPerforming: [
          { content: 'Fitness Routine Demo', revenue: '₦24.5K', change: 18.3 },
          { content: 'Cooking Tutorial: Pasta', revenue: '₦18.7K', change: 12.5 },
          { content: 'Tech Review: New Smartphone', revenue: '₦15.4K', change: 9.7 },
          { content: 'Summer Adventure Photos', revenue: '₦12.1K', change: 7.2 }
        ]
      };
    }
  }

  async getScheduledContent(): Promise<ScheduledContent[]> {
    try {
      const response = await api.get<ScheduledContent[]>('/ugc/scheduler/content');
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
      return [
        { id: '1', title: 'New Product Announcement', date: 'Tomorrow, 10:00 AM', type: 'post' },
        { id: '2', title: 'Behind the Scenes', date: 'Dec 15, 2:30 PM', type: 'video' },
        { id: '3', title: 'Weekly Update', date: 'Dec 18, 9:00 AM', type: 'post' }
      ];
    }
  }

  async getBestPostingTimes(): Promise<BestPostingTime[]> {
    try {
      const response = await api.get<BestPostingTime[]>('/ugc/scheduler/best-times');
      return response.data;
    } catch (error) {
      console.error('Error fetching best posting times:', error);
      return [
        { day: 'Monday', time: '10:00 AM - 12:00 PM', engagement: 'High' },
        { day: 'Wednesday', time: '2:00 PM - 4:00 PM', engagement: 'High' },
        { day: 'Friday', time: '6:00 PM - 8:00 PM', engagement: 'Very High' }
      ];
    }
  }
}

// Singleton export
export default new DashboardService();