import { api } from './api';
import {
  CommerceLuxuryServiceKey,
  CommerceLuxuryConsoleItem,
  CommerceLuxuryServiceOverview,
  SpawnedCommerceConsole
} from '../types/commerceLuxuryConsole';

export interface GetCommerceItemsParams {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const commerceLuxuryConsoleService = {
  /**
   * Fetch overview statistics for Marketplace, Storefront, Flamingo, OwnIt, FingerLux, and Tribut
   */
  async getOverview(): Promise<Record<CommerceLuxuryServiceKey, CommerceLuxuryServiceOverview>> {
    const response = await api.get('/commerce-luxury-console/overview');
    return response.data.services;
  },

  /**
   * Fetch items for a specific commerce or luxury service
   */
  async getServiceItems(
    serviceKey: CommerceLuxuryServiceKey,
    params?: GetCommerceItemsParams
  ): Promise<{ items: CommerceLuxuryConsoleItem[]; total: number }> {
    const response = await api.get(`/commerce-luxury-console/service/${serviceKey}`, { params });
    return {
      items: response.data.data || [],
      total: response.data.pagination?.total || 0
    };
  },

  /**
   * Create a new product, luxury listing, or tokenized deed
   */
  async createItem(
    serviceKey: CommerceLuxuryServiceKey,
    data: Partial<CommerceLuxuryConsoleItem>
  ): Promise<CommerceLuxuryConsoleItem> {
    const response = await api.post(`/commerce-luxury-console/service/${serviceKey}`, data);
    return response.data.item;
  },

  /**
   * Update an existing commerce item
   */
  async updateItem(
    serviceKey: CommerceLuxuryServiceKey,
    id: number,
    data: Partial<CommerceLuxuryConsoleItem>
  ): Promise<CommerceLuxuryConsoleItem> {
    const response = await api.put(`/commerce-luxury-console/service/${serviceKey}/${id}`, data);
    return response.data.item;
  },

  /**
   * Delete an item
   */
  async deleteItem(serviceKey: CommerceLuxuryServiceKey, id: number): Promise<void> {
    await api.delete(`/commerce-luxury-console/service/${serviceKey}/${id}`);
  },

  /**
   * Reorder items atomically in PostgreSQL
   */
  async reorderItems(
    serviceKey: CommerceLuxuryServiceKey,
    orders: { id: number; display_order: number }[]
  ): Promise<void> {
    await api.post(`/commerce-luxury-console/service/${serviceKey}/reorder`, { orders });
  },

  /**
   * Toggle freeze / unfreeze status on an item
   */
  async toggleFreeze(serviceKey: CommerceLuxuryServiceKey, id: number): Promise<CommerceLuxuryConsoleItem> {
    const response = await api.post(`/commerce-luxury-console/service/${serviceKey}/${id}/toggle-freeze`);
    return response.data.item;
  },

  /**
   * Report an item to PostgreSQL compliance & moderation queue
   */
  async reportItem(
    serviceKey: CommerceLuxuryServiceKey,
    id: number,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/commerce-luxury-console/service/${serviceKey}/${id}/report`, { reason });
    return response.data;
  },

  /**
   * Upload media file (multipart/form-data to Express backend)
   */
  async uploadMedia(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; filename: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('mediaFile', file);

    const response = await api.post('/commerce-luxury-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });

    return response.data;
  },

  /**
   * One-Click Console Spawner: create a new operational commerce console
   */
  async spawnConsole(data: {
    console_name: string;
    slug?: string;
    service_key: CommerceLuxuryServiceKey;
    description?: string;
    config?: Record<string, any>;
  }): Promise<SpawnedCommerceConsole> {
    const response = await api.post('/commerce-luxury-console/spawn-console', data);
    return response.data.spawnedConsole;
  },

  /**
   * Fetch all spawned consoles
   */
  async getSpawnedConsoles(): Promise<SpawnedCommerceConsole[]> {
    const response = await api.get('/commerce-luxury-console/spawned-consoles');
    return response.data.consoles || [];
  }
};

export default commerceLuxuryConsoleService;
