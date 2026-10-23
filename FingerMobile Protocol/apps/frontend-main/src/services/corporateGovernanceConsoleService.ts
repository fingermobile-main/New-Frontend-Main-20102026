import { api } from './api';
import {
  CorporateGovernanceDomain,
  CorporateGovernanceItem,
  CorporateGovernanceOverview,
  CorporateGovernanceSpawnedConsole,
  CreateCorporateGovernanceItemPayload,
  ReorderEntry
} from '../types/corporateGovernanceConsole';

export const corporateGovernanceConsoleService = {
  /**
   * Fetch overarching corporate governance and regulatory metrics
   */
  async getOverview(): Promise<CorporateGovernanceOverview> {
    const response = await api.get('/corporate-governance-console/overview');
    return response.data.data;
  },

  /**
   * Fetch governance items (optionally filtered by domain)
   */
  async getItems(domain?: CorporateGovernanceDomain | 'all'): Promise<CorporateGovernanceItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/corporate-governance-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new corporate governance entity, committee, policy, or license
   */
  async createItem(payload: CreateCorporateGovernanceItemPayload): Promise<CorporateGovernanceItem> {
    const response = await api.post('/corporate-governance-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing corporate governance item
   */
  async updateItem(id: string, payload: Partial<CorporateGovernanceItem>): Promise<CorporateGovernanceItem> {
    const response = await api.put(`/corporate-governance-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a governance item
   */
  async toggleFreeze(id: string): Promise<CorporateGovernanceItem> {
    const response = await api.patch(`/corporate-governance-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder governance items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/corporate-governance-console/reorder', { orders });
  },

  /**
   * Purge an item from the corporate governance registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/corporate-governance-console/items/${id}`);
  },

  /**
   * Multipart upload for regulatory charters, appointment deeds, license certificates
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'charter_document_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/corporate-governance-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign governance console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<CorporateGovernanceSpawnedConsole> {
    const response = await api.post('/corporate-governance-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Retrieve all dynamically spawned governance consoles
   */
  async getSpawnedConsoles(): Promise<CorporateGovernanceSpawnedConsole[]> {
    const response = await api.get('/corporate-governance-console/spawns');
    return response.data.data || [];
  }
};
