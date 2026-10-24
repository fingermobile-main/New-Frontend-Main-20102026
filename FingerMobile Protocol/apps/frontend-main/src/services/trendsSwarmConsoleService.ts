import { api } from './api';
import {
  TrendSwarmItem,
  TrendsSwarmOverview,
  TrendsSwarmSpawnedConsole,
  CreateTrendSwarmPayload,
  UpdateTrendSwarmPayload,
  TrendCategory
} from '../types/trendsSwarmConsole';

export interface ReorderEntry {
  id: string | number;
  display_order: number;
}

export const trendsSwarmConsoleService = {
  /**
   * Fetch overarching Trends & Swarms cluster metrics
   */
  async getOverview(): Promise<TrendsSwarmOverview> {
    const response = await api.get('/trends-swarm-console/overview');
    return response.data.data;
  },

  /**
   * Fetch trends with optional filters
   */
  async getItems(category?: TrendCategory | 'all', search?: string, boostedOnly?: boolean): Promise<TrendSwarmItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'all') params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (boostedOnly) params.boosted_only = 'true';

    const response = await api.get('/trends-swarm-console/items', { params });
    return response.data.data;
  },

  /**
   * Fetch individual trend detail
   */
  async getItemById(id: string | number): Promise<TrendSwarmItem> {
    const response = await api.get(`/trends-swarm-console/items/${id}`);
    return response.data.data;
  },

  /**
   * Create trend / swarm topic in PostgreSQL
   */
  async createItem(payload: CreateTrendSwarmPayload): Promise<TrendSwarmItem> {
    const response = await api.post('/trends-swarm-console/items', payload);
    return response.data.data;
  },

  /**
   * Update trend properties (decay rate, GNN weight, boosted)
   */
  async updateItem(id: string | number, payload: UpdateTrendSwarmPayload): Promise<TrendSwarmItem> {
    const response = await api.put(`/trends-swarm-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Delete / purge trend from feed
   */
  async deleteItem(id: string | number): Promise<void> {
    await api.delete(`/trends-swarm-console/items/${id}`);
  },

  /**
   * Reorder trends priority sequence atomically
   */
  async reorderItems(reorders: ReorderEntry[]): Promise<void> {
    await api.post('/trends-swarm-console/reorder', { reorders });
  },

  /**
   * Direct multipart/form-data upload for trend badge media
   */
  async uploadAsset(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('asset', file);

    const response = await api.post('/trends-swarm-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  },

  /**
   * DefCon Virality Clamp & Blacklist Control
   */
  async toggleViralityClamp(mode: 'emergency_clamp' | 'restore_normal', category?: string): Promise<{ affected_count: number; message: string }> {
    const response = await api.post('/trends-swarm-console/defcon-clamp', { mode, category });
    return response.data;
  },

  /**
   * Fetch spawned swarm analysis sentinels
   */
  async getSpawns(): Promise<TrendsSwarmSpawnedConsole[]> {
    const response = await api.get('/trends-swarm-console/spawns');
    return response.data.data;
  },

  /**
   * Spawn a new regional swarm analysis sentinel
   */
  async spawnConsole(payload: { title: string; domain: string; badge: string; description: string; instances?: number }): Promise<TrendsSwarmSpawnedConsole> {
    const response = await api.post('/trends-swarm-console/spawns', payload);
    return response.data.data;
  }
};
