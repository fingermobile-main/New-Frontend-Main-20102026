import { api } from './api';
import {
  CamusEnclaveConsoleItem,
  CamusEnclaveConsoleOverview,
  CamusEnclaveConsoleSpawn
} from '../types/camusEnclaveConsole';

export const camusEnclaveConsoleService = {
  async getOverview(): Promise<CamusEnclaveConsoleOverview> {
    const response = await api.get('/camus-enclave-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<CamusEnclaveConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/camus-enclave-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<CamusEnclaveConsoleItem>): Promise<CamusEnclaveConsoleItem> {
    const response = await api.post('/camus-enclave-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<CamusEnclaveConsoleItem>): Promise<CamusEnclaveConsoleItem> {
    const response = await api.put(`/camus-enclave-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<CamusEnclaveConsoleItem> {
    const response = await api.patch(`/camus-enclave-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<CamusEnclaveConsoleItem[]> {
    const response = await api.post('/camus-enclave-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/camus-enclave-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: CamusEnclaveConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/camus-enclave-console/items/${id}/upload`, formData, {
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
  }): Promise<CamusEnclaveConsoleSpawn> {
    const response = await api.post('/camus-enclave-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<CamusEnclaveConsoleSpawn[]> {
    const response = await api.get('/camus-enclave-console/spawns');
    return response.data.spawns || [];
  }
};
