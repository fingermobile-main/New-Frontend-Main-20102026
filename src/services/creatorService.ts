import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface CreatorProfile {
  id: string; userId: string;
  username: string; displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  followers: number; totalEarnings: number;
  contentCount: number; verified: boolean;
  joinedAt: string;
}

export interface CreatorStats {
  totalViews: number; totalLikes: number;
  totalComments: number; totalShares: number;
  averageEngagementRate: number; growthRate: number;
}

class CreatorService {
  private api = axios.create({baseURL: `${API_BASE_URL}/discover`, headers: {
    'Content-Type': 'application/json'
  }
  });

  async getCreatorProfile(userId: string): Promise<CreatorProfile> {
    const response = await this.api.get(`/profile/${userId}`);
    return response.data;
  }

  async updateCreatorProfile(userId: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const response = await this.api.put(`/profile/${userId}`, updates);
    return response.data;
  }

  async getCreatorStats(userId: string, period: string = '30d'): Promise<CreatorStats> {
    const response = await this.api.get(`/stats/${userId}`, {params: { period } });
    return response.data;
  }

  async getAudienceAnalytics(userId: string): Promise<{ demographics: {
  age: string; percentage: number }[];
locations: {country: string; percentage: number }[];
activeTimes: {hour: number; day: string;
  activity: number }[];
interests: string[];
  }> {
    const response = await this.api.get(`/audience/${userId}`);
    return response.data;
  }

  async getContentPerformance(userId: string, limit: number = 20): Promise<any[]> {
    const response = await this.api.get(`/content/${userId}`, {params: { limit } });
    return response.data;
  }

  async getEarningsSummary(userId: string, period: string = '30d'): Promise<{ totalEarned: number; projectedMonthly: number;
  topRevenueSource: string; earningsByType: {
  type: string; amount: number }[];
  }> {
    const response = await this.api.get(`/earnings/${userId}`, {params: { period } });
    return response.data;
  }

  async getSponsorshipOpportunities(userId: string): Promise<any[]> {
    const response = await this.api.get(`/sponsorships/${userId}`);
    return response.data;
  }

  async applyForVerification(userId: string, documents: File[]): Promise<void> {
    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append('documents', doc);
    });

    await this.api.post(`/verify/${userId}`, formData, {headers: {
      'Content-Type': 'multipart/form-data'
    }
    });
  }

  async getMonetizationOptions(userId: string): Promise<{ subscriptions: boolean; tips: boolean;
  sponsorships: boolean; merchandise: boolean;
  courses: boolean;
  }> {
    const response = await this.api.get(`/monetization/${userId}`);
    return response.data;
  }

  async enableMonetization(userId: string, options: string[]): Promise<void> {
    await this.api.post(`/monetization/${userId}/enable`, { options });
  }

  async getCollaborationRequests(userId: string): Promise<any[]> {
    const response = await this.api.get(`/collaborations/${userId}`);
    return response.data;
  }

  async getContentCalendar(userId: string): Promise<any[]> {
    const response = await this.api.get(`/calendar/${userId}`);
    return response.data;
  }

  async scheduleContent(userId: string, contentData: unknown): Promise<void> {
    await this.api.post(`/calendar/${userId}/schedule`, contentData);
  }
}

export const creatorService = new CreatorService();
export default creatorService;
