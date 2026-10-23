import { api } from './api';
import {
  MediaStreamingServiceKey,
  MediaStreamingConsoleItem,
  MediaStreamingServiceOverview,
  SpawnedMediaConsole
} from '../types/mediaStreamingConsole';

export interface GetMediaItemsParams {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const mediaStreamingConsoleService = {
  /**
   * Fetch overview statistics for BeatwaveNG, Dancia-4Tv, and VideoBox
   */
  async getOverview(): Promise<Record<MediaStreamingServiceKey, MediaStreamingServiceOverview>> {
    const response = await api.get('/media-streaming-console/overview');
    return response.data.services;
  },

  /**
   * Fetch items for a specific streaming service with search and category filters
   */
  async getServiceItems(
    serviceKey: MediaStreamingServiceKey,
    params?: GetMediaItemsParams
  ): Promise<{ items: MediaStreamingConsoleItem[]; total: number }> {
    const response = await api.get(`/media-streaming-console/service/${serviceKey}`, { params });
    return {
      items: response.data.data || [],
      total: response.data.pagination?.total || 0
    };
  },

  /**
   * Create a new track, stream, or video showcase
   */
  async createItem(
    serviceKey: MediaStreamingServiceKey,
    data: Partial<MediaStreamingConsoleItem>
  ): Promise<MediaStreamingConsoleItem> {
    const response = await api.post(`/media-streaming-console/service/${serviceKey}`, data);
    return response.data.item;
  },

  /**
   * Update an existing media item
   */
  async updateItem(
    serviceKey: MediaStreamingServiceKey,
    id: number,
    data: Partial<MediaStreamingConsoleItem>
  ): Promise<MediaStreamingConsoleItem> {
    const response = await api.put(`/media-streaming-console/service/${serviceKey}/${id}`, data);
    return response.data.item;
  },

  /**
   * Delete an item
   */
  async deleteItem(serviceKey: MediaStreamingServiceKey, id: number): Promise<void> {
    await api.delete(`/media-streaming-console/service/${serviceKey}/${id}`);
  },

  /**
   * Reorder items atomically in PostgreSQL
   */
  async reorderItems(
    serviceKey: MediaStreamingServiceKey,
    orders: { id: number; display_order: number }[]
  ): Promise<void> {
    await api.post(`/media-streaming-console/service/${serviceKey}/reorder`, { orders });
  },

  /**
   * Toggle freeze / unfreeze status on an item
   */
  async toggleFreeze(serviceKey: MediaStreamingServiceKey, id: number): Promise<MediaStreamingConsoleItem> {
    const response = await api.post(`/media-streaming-console/service/${serviceKey}/${id}/toggle-freeze`);
    return response.data.item;
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

    const response = await api.post('/media-streaming-console/upload', formData, {
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
   * One-Click Console Spawner: create a new operational console
   */
  async spawnConsole(data: {
    console_name: string;
    slug?: string;
    service_key: MediaStreamingServiceKey;
    description?: string;
    config?: Record<string, any>;
  }): Promise<SpawnedMediaConsole> {
    const response = await api.post('/media-streaming-console/spawn-console', data);
    return response.data.spawnedConsole;
  },

  /**
   * Fetch all spawned consoles
   */
  async getSpawnedConsoles(): Promise<SpawnedMediaConsole[]> {
    const response = await api.get('/media-streaming-console/spawned-consoles');
    return response.data.consoles || [];
  }
};

export default mediaStreamingConsoleService;
