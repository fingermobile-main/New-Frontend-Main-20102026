import { api } from './api';
import {
  MarketingCampaignConsoleItem,
  MarketingCampaignConsoleOverview,
  MarketingCampaignConsoleSpawn
} from '../types/marketingCampaignConsole';

export const marketingCampaignConsoleService = {
  async getOverview(): Promise<MarketingCampaignConsoleOverview> {
    const response = await api.get('/marketing-campaign-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<MarketingCampaignConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/marketing-campaign-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<MarketingCampaignConsoleItem>): Promise<MarketingCampaignConsoleItem> {
    const response = await api.post('/marketing-campaign-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<MarketingCampaignConsoleItem>): Promise<MarketingCampaignConsoleItem> {
    const response = await api.put(`/marketing-campaign-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<MarketingCampaignConsoleItem> {
    const response = await api.patch(`/marketing-campaign-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<MarketingCampaignConsoleItem[]> {
    const response = await api.post('/marketing-campaign-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/marketing-campaign-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: MarketingCampaignConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/marketing-campaign-console/items/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    route: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<MarketingCampaignConsoleSpawn> {
    const response = await api.post('/marketing-campaign-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<MarketingCampaignConsoleSpawn[]> {
    const response = await api.get('/marketing-campaign-console/spawns');
    return response.data.spawns || [];
  }
};
