import { api } from './api';
import {
  RbacPermissionsDomain,
  RbacPermissionsItem,
  RbacPermissionsOverview,
  RbacPermissionsSpawnedConsole,
  CreateRbacPermissionsItemPayload,
  ReorderEntry
} from '../types/rbacPermissionsConsole';

export const rbacPermissionsConsoleService = {
  /**
   * Fetch overarching Members, RBAC Permissions & Organization Citadel metrics
   */
  async getOverview(): Promise<RbacPermissionsOverview> {
    const response = await api.get('/rbac-permissions-console/overview');
    return response.data.data;
  },

  /**
   * Fetch RBAC and permission items (optionally filtered by domain)
   */
  async getItems(domain?: RbacPermissionsDomain | 'all'): Promise<RbacPermissionsItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/rbac-permissions-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new sovereign role, route permission gate, merchant KYC rule, or council seat
   */
  async createItem(payload: CreateRbacPermissionsItemPayload): Promise<RbacPermissionsItem> {
    const response = await api.post('/rbac-permissions-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing RBAC permission item
   */
  async updateItem(id: string, payload: Partial<RbacPermissionsItem>): Promise<RbacPermissionsItem> {
    const response = await api.put(`/rbac-permissions-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on an RBAC permission rule
   */
  async toggleFreeze(id: string): Promise<RbacPermissionsItem> {
    const response = await api.patch(`/rbac-permissions-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder RBAC permission items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/rbac-permissions-console/reorder', { orders });
  },

  /**
   * Purge an RBAC permission rule from the platform registry
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/rbac-permissions-console/items/${id}`);
  },

  /**
   * Multipart upload for credential certificates, CAC corporate documents, council charters
   */
  async uploadMedia(
    file: File,
    itemId?: string,
    field: string = 'credential_cert_url'
  ): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (itemId) formData.append('itemId', itemId);
    formData.append('field', field);

    const response = await api.post('/rbac-permissions-console/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * Spawn a new dynamic sovereign RBAC sub-console
   */
  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<RbacPermissionsSpawnedConsole> {
    const response = await api.post('/rbac-permissions-console/spawns', payload);
    return response.data.data;
  },

  /**
   * Fetch all spawned RBAC consoles
   */
  async getSpawnedConsoles(): Promise<RbacPermissionsSpawnedConsole[]> {
    const response = await api.get('/rbac-permissions-console/spawns');
    return response.data.data || [];
  }
};
