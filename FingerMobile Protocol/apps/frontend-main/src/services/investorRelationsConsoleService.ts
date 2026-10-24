import { api } from './api';
import {
  InvestorRelationsConsoleItem,
  InvestorRelationsConsoleOverview,
  InvestorRelationsConsoleSpawn
} from '../types/investorRelationsConsole';

export const investorRelationsConsoleService = {
  async getOverview(): Promise<InvestorRelationsConsoleOverview> {
    const response = await api.get('/investor-relations-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<InvestorRelationsConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/investor-relations-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<InvestorRelationsConsoleItem>): Promise<InvestorRelationsConsoleItem> {
    const response = await api.post('/investor-relations-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<InvestorRelationsConsoleItem>): Promise<InvestorRelationsConsoleItem> {
    const response = await api.put(`/investor-relations-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<InvestorRelationsConsoleItem> {
    const response = await api.patch(`/investor-relations-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<InvestorRelationsConsoleItem[]> {
    const response = await api.post('/investor-relations-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/investor-relations-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: InvestorRelationsConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/investor-relations-console/items/${id}/upload`, formData, {
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
  }): Promise<InvestorRelationsConsoleSpawn> {
    const response = await api.post('/investor-relations-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<InvestorRelationsConsoleSpawn[]> {
    const response = await api.get('/investor-relations-console/spawns');
    return response.data.spawns || [];
  }
};
