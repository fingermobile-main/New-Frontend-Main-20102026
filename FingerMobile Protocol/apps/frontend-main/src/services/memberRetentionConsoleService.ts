import { api } from './api';
import {
  MemberRetentionConsoleItem,
  MemberRetentionConsoleOverview,
  MemberRetentionConsoleSpawn
} from '../types/memberRetentionConsole';

export const memberRetentionConsoleService = {
  async getOverview(): Promise<MemberRetentionConsoleOverview> {
    const response = await api.get('/member-retention-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<MemberRetentionConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/member-retention-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<MemberRetentionConsoleItem>): Promise<MemberRetentionConsoleItem> {
    const response = await api.post('/member-retention-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<MemberRetentionConsoleItem>): Promise<MemberRetentionConsoleItem> {
    const response = await api.put(`/member-retention-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<MemberRetentionConsoleItem> {
    const response = await api.patch(`/member-retention-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<MemberRetentionConsoleItem[]> {
    const response = await api.post('/member-retention-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/member-retention-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: MemberRetentionConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/member-retention-console/items/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async spawnConsole(payload: {
    console_title: string;
    target_domain: string;
    route: string;
    icon_name?: string;
    badge_text?: string;
    config?: Record<string, any>;
  }): Promise<MemberRetentionConsoleSpawn> {
    const response = await api.post('/member-retention-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<MemberRetentionConsoleSpawn[]> {
    const response = await api.get('/member-retention-console/spawns');
    return response.data.spawns || [];
  }
};
