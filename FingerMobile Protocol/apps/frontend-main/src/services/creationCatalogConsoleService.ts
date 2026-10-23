import { api } from './api';
import {
  CreationCatalogDomain,
  CreationCatalogItem,
  CreationCatalogOverview,
  CreationCatalogSpawnedConsole,
  CreateCreationCatalogItemPayload,
  ReorderEntry
} from '../types/creationCatalogConsole';

export const creationCatalogConsoleService = {
  /**
   * Fetch overarching creation, catalog, widgets and subscriptions metrics
   */
  async getOverview(): Promise<CreationCatalogOverview> {
    const response = await api.get('/creation-catalog-console/overview');
    return response.data.data;
  },

  /**
   * Fetch catalog items (optionally filtered by domain)
   */
  async getItems(domain?: CreationCatalogDomain | 'all'): Promise<CreationCatalogItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/creation-catalog-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new screen, rotational widget rail, subscription tier, or custom console
   */
  async createItem(payload: CreateCreationCatalogItemPayload): Promise<CreationCatalogItem> {
    const response = await api.post('/creation-catalog-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing catalog item
   */
  async updateItem(id: string, payload: Partial<CreationCatalogItem>): Promise<CreationCatalogItem> {
    const response = await api.put(`/creation-catalog-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a catalog asset
   */
  async toggleFreeze(id: string): Promise<CreationCatalogItem> {
    const response = await api.patch(`/creation-catalog-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder catalog assets atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/creation-catalog-console/reorder', { orders });
  },

  /**
   * Purge an item from the catalog registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/creation-catalog-console/items/${id}`);
  },

  /**
   * Multipart upload for screen mockups, widget artwork, subscription badges, SEO sitemaps
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'media_asset_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/creation-catalog-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign catalog / custom console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<CreationCatalogSpawnedConsole> {
    const response = await api.post('/creation-catalog-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Retrieve all dynamically spawned catalog consoles
   */
  async getSpawnedConsoles(): Promise<CreationCatalogSpawnedConsole[]> {
    const response = await api.get('/creation-catalog-console/spawns');
    return response.data.data || [];
  }
};
