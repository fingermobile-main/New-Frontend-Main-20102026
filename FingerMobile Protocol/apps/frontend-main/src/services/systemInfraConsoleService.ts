import { api } from './api';
import {
  SystemInfraDomain,
  SystemInfraItem,
  SystemInfraOverview,
  SystemInfraSpawnedConsole,
  CreateSystemInfraItemPayload,
  ReorderEntry
} from '../types/systemInfraConsole';

export const systemInfraConsoleService = {
  /**
   * Fetch overarching system infrastructure and engineering telemetry
   */
  async getOverview(): Promise<SystemInfraOverview> {
    const response = await api.get('/system-infra-console/overview');
    return response.data.data;
  },

  /**
   * Fetch infrastructure nodes (optionally filtered by domain)
   */
  async getItems(domain?: SystemInfraDomain | 'all'): Promise<SystemInfraItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/system-infra-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new infrastructure node, pipeline, queue worker or database cluster
   */
  async createItem(payload: CreateSystemInfraItemPayload): Promise<SystemInfraItem> {
    const response = await api.post('/system-infra-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing infrastructure node or config
   */
  async updateItem(id: string, payload: Partial<SystemInfraItem>): Promise<SystemInfraItem> {
    const response = await api.put(`/system-infra-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on an infrastructure node
   */
  async toggleFreeze(id: string): Promise<SystemInfraItem> {
    const response = await api.patch(`/system-infra-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder infrastructure nodes atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/system-infra-console/reorder', { orders });
  },

  /**
   * Purge an item from the infrastructure registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/system-infra-console/items/${id}`);
  },

  /**
   * Multipart upload for Docker Compose, K8s manifests, network topology files
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'config_manifest_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/system-infra-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign infrastructure console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<SystemInfraSpawnedConsole> {
    const response = await api.post('/system-infra-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Retrieve all dynamically spawned infrastructure consoles
   */
  async getSpawnedConsoles(): Promise<SystemInfraSpawnedConsole[]> {
    const response = await api.get('/system-infra-console/spawns');
    return response.data.data || [];
  }
};
