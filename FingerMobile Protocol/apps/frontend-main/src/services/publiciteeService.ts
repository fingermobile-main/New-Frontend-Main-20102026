import React, {} from 'react';
/**
 * Publicitee Service - Advertising and Marketing Platform
 * Handles ad campaigns, impressions, clicks, and analytics
 */

import { api } from './api';

export interface AdCampaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface AdCreative {
  id: string;
  campaign_id: string;
  type: 'image' | 'video' | 'text';
  url: string;
  title: string;
  description?: string;
  cta_text: string;
  cta_url: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  location: string;
  dimensions: {
  width: number;
  height: number };
format: string[];
price_per_impression: number;
}

export interface CampaignAnalytics {
  campaign_id: string;
  total_impressions: number;
  total_clicks: number;
  total_spend: number;
  conversions: number;
  roi: number;
  daily_stats: {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  }[];
}

class PubliciteeService {
  private baseUrl = '/api/publicitee';

  async getCampaigns(status?: string): Promise<AdCampaign[]> {
    const response = await api.get(`${this.baseUrl}/campaigns`, {params: { status }
    });
    return response.data;
  }

  async createCampaign(campaign: Partial<AdCampaign>): Promise<AdCampaign> {
    const response = await api.post(`${this.baseUrl}/campaigns`, campaign);
    return response.data;
  }

  async updateCampaign(campaignId: string,
    updates: Partial<AdCampaign>): Promise<AdCampaign> {
    const response = await api.put(`${this.baseUrl}/campaigns/${campaignId}`, updates);
    return response.data;
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    await api.post(`${this.baseUrl}/campaigns/${campaignId}/pause`);
  }

  async resumeCampaign(campaignId: string): Promise<void> {
    await api.post(`${this.baseUrl}/campaigns/${campaignId}/resume`);
  }

  async getCreatives(campaignId: string): Promise<AdCreative[]> {
    const response = await api.get(`${this.baseUrl}/campaigns/${campaignId}/creatives`);
    return response.data;
  }

  async addCreative(campaignId: string,
    creative: Partial<AdCreative>): Promise<AdCreative> {
    const response = await api.post(`${this.baseUrl}/campaigns/${campaignId}/creatives`, creative);
    return response.data;
  }

  async getPlacements(): Promise<AdPlacement[]> {
    const response = await api.get(`${this.baseUrl}/placements`);
    return response.data;
  }

  async getAnalytics(campaignId: string,
    period: '7d' | '30d' | '90d' = '30d'): Promise<CampaignAnalytics> {
    const response = await api.get(`${this.baseUrl}/campaigns/${campaignId}/analytics`, {params: { period }
    });
    return response.data;
  }

  async getMyCampaigns(): Promise<AdCampaign[]> {
    const response = await api.get(`${this.baseUrl}/campaigns/my`);
    return response.data;
  }
}

export const publiciteeService = new PubliciteeService();
