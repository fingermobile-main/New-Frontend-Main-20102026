import { api } from './api';
import {
  CreatorMonetizationDomain,
  CreatorMonetizationItem,
  CreatorMonetizationOverview,
  CreatorMonetizationSpawnedConsole,
  CreateCreatorMonetizationItemPayload,
  ReorderEntry
} from '../types/creatorMonetizationConsole';

export const creatorMonetizationConsoleService = {
  /**
   * Fetch overarching Creator Studio, Monetization & Payouts Engine metrics
   */
  async getOverview(): Promise<CreatorMonetizationOverview> {
    const response = await api.get('/creator-monetization-console/overview');
    return response.data.data;
  },

  /**
   * Fetch monetization items (optionally filtered by domain)
   */
  async getItems(domain?: CreatorMonetizationDomain | 'all'): Promise<CreatorMonetizationItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/creator-monetization-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new creator tier, ad split, gifting vault, staking pool, or PPV gate
   */
  async createItem(payload: CreateCreatorMonetizationItemPayload): Promise<CreatorMonetizationItem> {
    const response = await api.post('/creator-monetization-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing creator monetization node
   */
  async updateItem(id: string, payload: Partial<CreatorMonetizationItem>): Promise<CreatorMonetizationItem> {
    const response = await api.put(`/creator-monetization-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a monetization node
   */
  async toggleFreeze(id: string): Promise<CreatorMonetizationItem> {
    const response = await api.patch(`/creator-monetization-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder monetization items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/creator-monetization-console/reorder', { orders });
  },

  /**
   * Purge a creator monetization node from the platform registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/creator-monetization-console/items/${id}`);
  },

  /**
   * Multipart upload for creator agreements, revenue manifests, proof of payouts
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'contract_manifest_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/creator-monetization-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign creator monetization console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<CreatorMonetizationSpawnedConsole> {
    const response = await api.post('/creator-monetization-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Fetch all spawned creator monetization consoles
   */
  async getSpawnedConsoles(): Promise<CreatorMonetizationSpawnedConsole[]> {
    const response = await api.get('/creator-monetization-console/spawns');
    return response.data.data || [];
  }
};
