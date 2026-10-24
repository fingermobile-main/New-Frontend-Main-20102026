import { api } from './api';
import {
  LoansQrItem,
  LoansQrOverview,
  LoansQrSpawnedConsole,
  CreateLoansQrPayload,
  UpdateLoansQrPayload,
  LoansQrCategory
} from '../types/loansqrConsole';

export interface ReorderEntry {
  id: string | number;
  display_order: number;
}

export const loansqrConsoleService = {
  /**
   * Fetch overarching LoansQR cluster metrics
   */
  async getOverview(): Promise<LoansQrOverview> {
    const response = await api.get('/loansqr-console/overview');
    return response.data.data;
  },

  /**
   * Fetch loan facilities with optional filters
   */
  async getItems(category?: LoansQrCategory | 'all', search?: string, activeOnly?: boolean): Promise<LoansQrItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'all') params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (activeOnly) params.active_only = 'true';

    const response = await api.get('/loansqr-console/items', { params });
    return response.data.data;
  },

  /**
   * Fetch facility detail
   */
  async getItemById(id: string | number): Promise<LoansQrItem> {
    const response = await api.get(`/loansqr-console/items/${id}`);
    return response.data.data;
  },

  /**
   * Create loan underwriting product
   */
  async createItem(payload: CreateLoansQrPayload): Promise<LoansQrItem> {
    const response = await api.post('/loansqr-console/items', payload);
    return response.data.data;
  },

  /**
   * Update loan underwriting facility
   */
  async updateItem(id: string | number, payload: UpdateLoansQrPayload): Promise<LoansQrItem> {
    const response = await api.put(`/loansqr-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Delete loan facility
   */
  async deleteItem(id: string | number): Promise<void> {
    await api.delete(`/loansqr-console/items/${id}`);
  },

  /**
   * Reorder lending priority sequence atomically
   */
  async reorderItems(reorders: ReorderEntry[]): Promise<void> {
    await api.post('/loansqr-console/reorder', { reorders });
  },

  /**
   * Direct multipart/form-data Express upload for underwriting deeds
   */
  async uploadCollateralDoc(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('collateral_doc', file);

    const response = await api.post('/loansqr-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  },

  /**
   * DefCon Debt Moratorium Hold Toggle
   */
  async toggleMoratoriumHold(scope: 'all' | LoansQrCategory, active: boolean): Promise<{ affected_count: number; message: string }> {
    const response = await api.post('/loansqr-console/defcon-moratorium', { scope, active });
    return response.data;
  },

  /**
   * Fetch spawned underwriting shards
   */
  async getSpawns(): Promise<LoansQrSpawnedConsole[]> {
    const response = await api.get('/loansqr-console/spawns');
    return response.data.data;
  },

  /**
   * Spawn a new regional LoansQR lending shard
   */
  async spawnConsole(payload: { title: string; domain: string; badge: string; description: string; instances?: number }): Promise<LoansQrSpawnedConsole> {
    const response = await api.post('/loansqr-console/spawns', payload);
    return response.data.data;
  }
};
