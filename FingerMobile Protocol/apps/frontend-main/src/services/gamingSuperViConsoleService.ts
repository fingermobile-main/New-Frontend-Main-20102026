import { api } from './api';
import {
  GamingSuperViDomain,
  GamingSuperViItem,
  GamingSuperViOverview,
  GamingSpawnedConsole,
  CreateGamingItemPayload,
  ReorderEntry
} from '../types/gamingSuperViConsole';

export const gamingSuperViConsoleService = {
  /**
   * Fetch overarching gaming & SuperVi metrics
   */
  async getOverview(): Promise<GamingSuperViOverview> {
    const response = await api.get('/gaming-supervi-console/overview');
    return response.data.data;
  },

  /**
   * Fetch gaming items (optionally filtered by domain)
   */
  async getItems(domain?: GamingSuperViDomain | 'all'): Promise<GamingSuperViItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/gaming-supervi-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new character, powerup, physics rule, or challenge
   */
  async createItem(payload: CreateGamingItemPayload): Promise<GamingSuperViItem> {
    const response = await api.post('/gaming-supervi-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing gaming console item
   */
  async updateItem(id: string, payload: Partial<GamingSuperViItem>): Promise<GamingSuperViItem> {
    const response = await api.put(`/gaming-supervi-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a gaming item
   */
  async toggleFreeze(id: string): Promise<GamingSuperViItem> {
    const response = await api.patch(`/gaming-supervi-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder gaming items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/gaming-supervi-console/reorder', { orders });
  },

  /**
   * Purge an item from the gaming console
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/gaming-supervi-console/items/${id}`);
  },

  /**
   * Multipart upload for character sprites, 3D glb models, audio stems
   */
  async uploadMedia(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; filename: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/gaming-supervi-console/upload', formData, {
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

    return response.data.data;
  },

  /**
   * Spawn a new dedicated gaming sub-console with one click
   */
  async spawnConsole(data: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    route?: string;
    config?: Record<string, any>;
  }): Promise<GamingSpawnedConsole> {
    const response = await api.post('/gaming-supervi-console/spawns', data);
    return response.data.data;
  },

  /**
   * Retrieve all dynamically spawned gaming consoles
   */
  async getSpawns(): Promise<GamingSpawnedConsole[]> {
    const response = await api.get('/gaming-supervi-console/spawns');
    return response.data.data || [];
  }
};
