import { api } from './api';
import {
  StercsEditorConsoleItem,
  StercsEditorConsoleOverview,
  StercsEditorConsoleSpawn
} from '../types/stercsEditorConsole';

export const stercsEditorConsoleService = {
  async getOverview(): Promise<StercsEditorConsoleOverview> {
    const response = await api.get('/stercs-editor-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<StercsEditorConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/stercs-editor-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<StercsEditorConsoleItem>): Promise<StercsEditorConsoleItem> {
    const response = await api.post('/stercs-editor-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<StercsEditorConsoleItem>): Promise<StercsEditorConsoleItem> {
    const response = await api.put(`/stercs-editor-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<StercsEditorConsoleItem> {
    const response = await api.patch(`/stercs-editor-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<StercsEditorConsoleItem[]> {
    const response = await api.post('/stercs-editor-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/stercs-editor-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: StercsEditorConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/stercs-editor-console/items/${id}/upload`, formData, {
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
  }): Promise<StercsEditorConsoleSpawn> {
    const response = await api.post('/stercs-editor-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<StercsEditorConsoleSpawn[]> {
    const response = await api.get('/stercs-editor-console/spawns');
    return response.data.spawns || [];
  }
};
