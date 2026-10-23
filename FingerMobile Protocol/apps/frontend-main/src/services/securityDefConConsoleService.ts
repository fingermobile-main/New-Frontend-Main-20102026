import { api } from './api';
import {
  SecurityDefConDomain,
  SecurityDefConItem,
  SecurityDefConOverview,
  SecurityDefConSpawnedConsole,
  CreateSecurityDefConItemPayload,
  ReorderEntry
} from '../types/securityDefConConsole';

export const securityDefConConsoleService = {
  /**
   * Fetch overarching Security, DefCon Threats & Hardware Enclaves overview metrics
   */
  async getOverview(): Promise<SecurityDefConOverview> {
    const response = await api.get('/security-defcon-console/overview');
    return response.data.data;
  },

  /**
   * Fetch security nodes and enclave items (optionally filtered by domain)
   */
  async getItems(domain?: SecurityDefConDomain | 'all'): Promise<SecurityDefConItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/security-defcon-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new security node, enclave, cryptographic vault, or DDoS shield
   */
  async createItem(payload: CreateSecurityDefConItemPayload): Promise<SecurityDefConItem> {
    const response = await api.post('/security-defcon-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing security enclave or threat defense node
   */
  async updateItem(id: string, payload: Partial<SecurityDefConItem>): Promise<SecurityDefConItem> {
    const response = await api.put(`/security-defcon-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a security node
   */
  async toggleFreeze(id: string): Promise<SecurityDefConItem> {
    const response = await api.patch(`/security-defcon-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder security nodes atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/security-defcon-console/reorder', { orders });
  },

  /**
   * Purge a security node from the DefCon registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/security-defcon-console/items/${id}`);
  },

  /**
   * Multipart upload for enclave certs, cryptographic manifests, threat logs
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'enclave_cert_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/security-defcon-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign security sub-console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<SecurityDefConSpawnedConsole> {
    const response = await api.post('/security-defcon-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Fetch all spawned security consoles
   */
  async getSpawnedConsoles(): Promise<SecurityDefConSpawnedConsole[]> {
    const response = await api.get('/security-defcon-console/spawns');
    return response.data.data || [];
  }
};
