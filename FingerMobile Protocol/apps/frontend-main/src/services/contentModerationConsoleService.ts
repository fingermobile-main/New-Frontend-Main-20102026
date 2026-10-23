import { api } from './api';
import {
  ContentModerationDomain,
  ContentModerationItem,
  ContentModerationOverview,
  ContentModerationSpawnedConsole,
  CreateContentModerationItemPayload,
  ReorderEntry
} from '../types/contentModerationConsole';

export const contentModerationConsoleService = {
  /**
   * Fetch overarching Content Moderation, Trust, Safety & Ethics metrics
   */
  async getOverview(): Promise<ContentModerationOverview> {
    const response = await api.get('/content-moderation-console/overview');
    return response.data.data;
  },

  /**
   * Fetch content moderation items (optionally filtered by domain)
   */
  async getItems(domain?: ContentModerationDomain | 'all'): Promise<ContentModerationItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/content-moderation-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new moderation rule, strike policy, youth shield, or copyright filter
   */
  async createItem(payload: CreateContentModerationItemPayload): Promise<ContentModerationItem> {
    const response = await api.post('/content-moderation-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing moderation policy node
   */
  async updateItem(id: string, payload: Partial<ContentModerationItem>): Promise<ContentModerationItem> {
    const response = await api.put(`/content-moderation-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a moderation rule
   */
  async toggleFreeze(id: string): Promise<ContentModerationItem> {
    const response = await api.patch(`/content-moderation-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder moderation rules atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/content-moderation-console/reorder', { orders });
  },

  /**
   * Purge a moderation policy from the registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/content-moderation-console/items/${id}`);
  },

  /**
   * Multipart upload for evidence manifests, forensic logs, tribunal filings, copyright certificates
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'evidence_manifest_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/content-moderation-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign content safety sub-console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<ContentModerationSpawnedConsole> {
    const response = await api.post('/content-moderation-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Fetch all spawned content moderation consoles
   */
  async getSpawnedConsoles(): Promise<ContentModerationSpawnedConsole[]> {
    const response = await api.get('/content-moderation-console/spawns');
    return response.data.data || [];
  }
};
