import React, {} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';

export interface Advertisement {
  id: string; title: string; description?: string;
  imageUrl?: string;
  ctaText: string; ctaUrl: string; type: 'banner' | 'sponsored' | 'inline'; status: 'active' | 'paused' | 'completed'; impressions: number; clicks: number; budget: number; startDate: string; endDate: string;
}

export interface Campaign {
  id: string; name: string; advertiserId: string; ads: Advertisement[]; totalBudget: number; spentBudget: number; startDate: string; endDate: string; status: 'active' | 'paused' | 'completed'; metrics: { impressions: number; clicks: number; conversions: number; ctr: number; revenue: number;
  };
}

export interface AdAnalytics {
  campaignId: string; period: string; impressions: number; clicks: number; conversions: number; ctr: number; cpc: number; revenue: number; roi: number;
}

class AdvertisementService {
  private api = axios.create({baseURL: `${API_BASE_URL}/advertisements`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async getCampaigns(advertiserId?: string): Promise<Campaign[]> {
    const response = await this.api.get('/campaigns', {
      params: { advertiserId } });
    return response.data;
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    const response = await this.api.post('/campaigns', campaignData);
    return response.data;
  }

  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
    const response = await this.api.put(`/campaigns/${campaignId}`, updates);
    return response.data;
  }

  async pauseCampaign(campaignId: string): Promise<Campaign> {
    const response = await this.api.post(`/campaigns/${campaignId}/pause`);
    return response.data;
  }

  async resumeCampaign(campaignId: string): Promise<Campaign> {
    const response = await this.api.post(`/campaigns/${campaignId}/resume`);
    return response.data;
  }

  async getAds(campaignId?: string): Promise<Advertisement[]> {
    const response = await this.api.get('/ads', {
      params: { campaignId } });
    return response.data;
  }

  async createAd(adData: Partial<Advertisement>): Promise<Advertisement> {
    const response = await this.api.post('/ads', adData);
    return response.data;
  }

  async trackImpression(adId: string): Promise<void> {
    await this.api.post(`/ads/${adId}/impression`);
  }

  async trackClick(adId: string): Promise<void> {
    await this.api.post(`/ads/${adId}/click`);
  }

  async getCampaignAnalytics(campaignId: string, period: string = '7d'): Promise<AdAnalytics> {
    const response = await this.api.get(`/campaigns/${campaignId}/analytics`, {
      params: { period } });
    return response.data;
  }

  async getActiveAds(limit: number = 5): Promise<Advertisement[]> {
    const response = await this.api.get('/ads/active', {
      params: { limit } });
    return response.data;
  }

  async getSponsoredContent(category?: string): Promise<Advertisement[]> {
    const response = await this.api.get('/ads/sponsored', {
      params: { category } });
    return response.data;
  }
}

export const advertisementService = new AdvertisementService();
export default advertisementService;
