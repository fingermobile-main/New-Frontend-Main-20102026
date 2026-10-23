import { api } from './api';
import {
  CommunityServiceKey,
  CommunityConsoleItem,
  CommunityServiceOverview,
  SpawnedConsole
} from '../types/communitiesConsole';

export interface GetServiceItemsParams {
  search?: string;
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const communitiesConsoleService = {
  /**
   * Fetch overview statistics for all 11 community services
   */
  async getOverview(): Promise<Record<CommunityServiceKey, CommunityServiceOverview>> {
    const response = await api.get('/communities-console/overview');
    return response.data.services;
  },

  /**
   * Fetch items for a specific community service with search and category filters
   */
  async getServiceItems(
    serviceKey: CommunityServiceKey,
    params?: GetServiceItemsParams
  ): Promise<{ items: CommunityConsoleItem[]; total: number }> {
    const response = await api.get(`/communities-console/service/${serviceKey}`, { params });
    return {
      items: response.data.items || [],
      total: response.data.total || 0
    };
  },

  /**
   * Create a new item for a community service
   */
  async createItem(
    serviceKey: CommunityServiceKey,
    data: Partial<CommunityConsoleItem>
  ): Promise<CommunityConsoleItem> {
    const response = await api.post(`/communities-console/service/${serviceKey}`, data);
    return response.data.item;
  },

  /**
   * Update an existing item
   */
  async updateItem(
    serviceKey: CommunityServiceKey,
    id: number,
    data: Partial<CommunityConsoleItem>
  ): Promise<CommunityConsoleItem> {
    const response = await api.put(`/communities-console/service/${serviceKey}/${id}`, data);
    return response.data.item;
  },

  /**
   * Delete an item
   */
  async deleteItem(serviceKey: CommunityServiceKey, id: number): Promise<void> {
    await api.delete(`/communities-console/service/${serviceKey}/${id}`);
  },

  /**
   * Reorder items up/down by updating display_order array
   */
  async reorderItems(
    serviceKey: CommunityServiceKey,
    orders: { id: number; display_order: number }[]
  ): Promise<void> {
    await api.post(`/communities-console/service/${serviceKey}/reorder`, { orders });
  },

  /**
   * Toggle freeze / unfreeze status on an item
   */
  async toggleFreeze(serviceKey: CommunityServiceKey, id: number): Promise<CommunityConsoleItem> {
    const response = await api.post(`/communities-console/service/${serviceKey}/${id}/toggle-freeze`);
    return response.data.item;
  },

  /**
   * Upload media file (multipart/form-data)
   */
  async uploadMedia(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('mediaFile', file);
    const response = await api.post('/communities-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Spawn a new operational sub-console with one click
   */
  async spawnConsole(data: {
    console_id: string;
    name: string;
    service_key: string;
    route: string;
    description: string;
    icon?: string;
  }): Promise<SpawnedConsole> {
    const response = await api.post('/communities-console/spawn-console', data);
    return response.data.console;
  },

  /**
   * Fetch all spawned consoles
   */
  async getSpawnedConsoles(): Promise<SpawnedConsole[]> {
    const response = await api.get('/communities-console/spawns');
    return response.data.consoles || [];
  }
};

export default communitiesConsoleService;
