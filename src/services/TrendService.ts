import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Trend {id: string; hashtag: string;
  category: string;
  posts: number;
  engagement: number;
  growth: number;
  period: string;
}

export interface TrendingContent {id: string; type: 'post' | 'video' | 'music' | 'product';
  title: string;
  authorId: string;
  authorName: string;
  engagement: number;
  views: number;
  likes: number;
  shares: number;
  trendScore: number;
}

class TrendService {
  private api = axios.create({
    baseURL: API_BASE_URL + '/trends',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async getTrendingHashtags(category?: string, limit: number = 20): Promise<Trend[]> {
    const response = await this.api.get('/hashtags', {params: { category,
      limit } });
    return response.data;
  }

  async getTrendingContent(type?: string, period: string = '24h', limit: number = 20): Promise<TrendingContent[]> {
    const response = await this.api.get('/content', {params: { type,
      period,
      limit } });
    return response.data;
  }

  async getTrendingPosts(limit: number = 20): Promise<TrendingContent[]> {
    const response = await this.api.get('/posts', {params: { limit } });
    return response.data;
  }

  async getTrendingVideos(limit: number = 20): Promise<TrendingContent[]> {
    const response = await this.api.get('/videos', {params: { limit } });
    return response.data;
  }

  async getTrendingMusic(limit: number = 20): Promise<TrendingContent[]> {
    const response = await this.api.get('/music', {params: { limit } });
    return response.data;
  }

  async getTrendingProducts(limit: number = 20): Promise<TrendingContent[]> {
    const response = await this.api.get('/products', {params: { limit } });
    return response.data;
  }

  async getTrendAnalytics(hashtag: string, period: string = '7d'): Promise<{ totalPosts: number;
  totalEngagement: number;
  growthRate: number;
  topContributors: any[];
  relatedTrends: string[];
  }> {
    const response = await this.api.get(`/${hashtag}/analytics`, {params: { period } });
    return response.data;
  }

  async getTrendHistory(userId: string, limit: number = 10): Promise<Trend[]> {
    const response = await this.api.get(`/user/${userId}/history`, {params: { limit } });
    return response.data;
  }

  async trackTrend(hashtag: string): Promise<void> {
    await this.api.post('/track', { hashtag });
  }

  async untrackTrend(hashtag: string): Promise<void> {
    await this.api.delete('/track', {data: { hashtag } });
  }

  async getCustomTrends(dateRange: {start: string;
  end: string }, categories?: string[]): Promise<Trend[]> {
    const response = await this.api.post('/custom', { dateRange, categories });
    return response.data;
  }
}

export const trendService = new TrendService();
export default trendService;
