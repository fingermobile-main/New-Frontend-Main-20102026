import ApiService from './api';
import AuthService from './authService';

export interface DailyActiveUsers {
  date: string;
  count: number;
}

export interface WeeklyActiveUsers {
  week: string;
  count: number;
}

export interface MonthlyActiveUsers {
  month: string;
  count: number;
}

export interface UserGrowthData {
  daily: DailyActiveUsers[];
  weekly: WeeklyActiveUsers[];
  monthly: MonthlyActiveUsers[];
}

export interface ContentStats {
  totalPosts: number;
  totalComments: number;
  totalMedia: number;
  avgEngagementRate: number;
  trendingTopics: string[];
}

export interface RevenueStats {
  totalRevenue: number;
  revenueByPeriod: {
    day: string;
    amount: number;
  }[];
  revenueByPlan: {
    plan: string;
    amount: number;
    percentage: number;
  }[];
  subscriptionStats: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    churnRate: number;
  };
}

export interface PlatformHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  serverStatus: string;
}

export interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  averageResolutionTime: number;
  actionTakenCount: number;
}

export interface UserDemographics {
  ageGroups: {
    range: string;
    count: number;
    percentage: number;
  }[];
  genderDistribution: {
    gender: string;
    count: number;
    percentage: number;
  }[];
  geographicDistribution: {
    country: string;
    count: number;
    percentage: number;
  }[];
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalRevenue: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  newUsersToday: number;
  newPostsToday: number;
  totalReports: number;
  activeSubscriptions: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceUsage {
  deviceType: string;
  count: number;
  percentage: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  
  private constructor() {}
  
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return ApiService.get('/analytics/dashboard-stats');
  }

  async getUserGrowth(params: { 
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  } = {}): Promise<UserGrowthData> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.period) queryParams.append('period', params.period);

    return ApiService.get(`/analytics/user-growth?${queryParams.toString()}`);
  }

  async getContentStats(params: { 
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ContentStats> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/analytics/content-stats?${queryParams.toString()}`);
  }

  async getRevenueStats(params: { 
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  } = {}): Promise<RevenueStats> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.period) queryParams.append('period', params.period);

    return ApiService.get(`/analytics/revenue-stats?${queryParams.toString()}`);
  }

  async getPlatformHealth(): Promise<PlatformHealth> {
    return ApiService.get('/analytics/platform-health');
  }

  async getModerationStats(params: { 
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ModerationStats> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/analytics/moderation-stats?${queryParams.toString()}`);
  }

  async getUserDemographics(): Promise<UserDemographics> {
    return ApiService.get('/analytics/user-demographics');
  }

  async getTrafficSources(params: { 
    startDate?: string;
    endDate?: string;
  } = {}): Promise<TrafficSource[]> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/analytics/traffic-sources?${queryParams.toString()}`);
  }

  async getDeviceUsage(params: { 
    startDate?: string;
    endDate?: string;
  } = {}): Promise<DeviceUsage[]> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/analytics/device-usage?${queryParams.toString()}`);
  }

  async exportAnalyticsReport(params: { 
    startDate: string;
    endDate: string;
    reportType: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    queryParams.append('reportType', params.reportType);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const token = AuthService.getToken();
    
    const response = await fetch(`${API_BASE_URL}/analytics/export?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to export analytics report');
    }

    return response.blob();
  }
}

export default AnalyticsService.getInstance();