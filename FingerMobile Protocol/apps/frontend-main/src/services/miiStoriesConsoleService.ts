import { api } from './api';
import {
  MiiStoryItem,
  MiiStoriesOverview,
  MiiStoriesSpawnedConsole,
  CreateMiiStoryPayload,
  UpdateMiiStoryPayload
} from '../types/miiStoriesConsole';

export interface ReorderEntry {
  id: string | number;
  display_order: number;
}

export const miiStoriesConsoleService = {
  /**
   * Fetch overarching Mii Stories cluster metrics
   */
  async getOverview(): Promise<MiiStoriesOverview> {
    const response = await api.get('/mii-stories-console/overview');
    return response.data.data;
  },

  /**
   * Fetch stories items with optional filters
   */
  async getItems(search?: string, status?: string, pinRequired?: string): Promise<MiiStoryItem[]> {
    const params: Record<string, string> = {};
    if (search && search.trim()) params.search = search.trim();
    if (status && status !== 'all') params.status = status;
    if (pinRequired && pinRequired !== 'all') params.pin_required = pinRequired;

    const response = await api.get('/mii-stories-console/items', { params });
    return response.data.data;
  },

  /**
   * Fetch individual story card
   */
  async getItemById(id: string | number): Promise<MiiStoryItem> {
    const response = await api.get(`/mii-stories-console/items/${id}`);
    return response.data.data;
  },

  /**
   * Publish story to PostgreSQL
   */
  async createItem(payload: CreateMiiStoryPayload): Promise<MiiStoryItem> {
    const response = await api.post('/mii-stories-console/items', payload);
    return response.data.data;
  },

  /**
   * Update story properties (duration, caption, pin, moderation)
   */
  async updateItem(id: string | number, payload: UpdateMiiStoryPayload): Promise<MiiStoryItem> {
    const response = await api.put(`/mii-stories-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Delete / purge individual story
   */
  async deleteItem(id: string | number): Promise<void> {
    await api.delete(`/mii-stories-console/items/${id}`);
  },

  /**
   * Reorder stories order atomically
   */
  async reorderItems(reorders: ReorderEntry[]): Promise<void> {
    await api.post('/mii-stories-console/reorder', { reorders });
  },

  /**
   * Direct multipart/form-data Express upload
   */
  async uploadMedia(file: File): Promise<{ url: string; media_type: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/mii-stories-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  },

  /**
   * Execute DefCon Vanishing Purge
   */
  async defconPurge(scope: 'expired_only' | 'flagged_only' | 'total_vanish'): Promise<{ purged_count: number; message: string }> {
    const response = await api.post('/mii-stories-console/defcon-purge', { scope });
    return response.data;
  },

  /**
   * Fetch dynamic spawned consoles
   */
  async getSpawns(): Promise<MiiStoriesSpawnedConsole[]> {
    const response = await api.get('/mii-stories-console/spawns');
    return response.data.data;
  },

  /**
   * Spawn a new Mii Orbit / PIN enclave console
   */
  async spawnConsole(payload: { title: string; domain: string; badge: string; description: string; instances?: number }): Promise<MiiStoriesSpawnedConsole> {
    const response = await api.post('/mii-stories-console/spawns', payload);
    return response.data.data;
  }
};
