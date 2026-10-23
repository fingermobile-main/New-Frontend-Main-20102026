import { api } from './api';
import {
  AnalyticsTelemetryConsoleItem,
  AnalyticsTelemetryConsoleOverview,
  AnalyticsTelemetryConsoleSpawn
} from '../types/analyticsTelemetryConsole';

export const analyticsTelemetryConsoleService = {
  async getOverview(): Promise<AnalyticsTelemetryConsoleOverview> {
    const response = await api.get('/analytics-telemetry-console/overview');
    return response.data.data;
  },

  async getItems(category?: string, status?: string, search?: string): Promise<AnalyticsTelemetryConsoleItem[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'ALL') params.category = category;
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/analytics-telemetry-console/items', { params });
    return response.data.items || [];
  },

  async createItem(payload: Partial<AnalyticsTelemetryConsoleItem>): Promise<AnalyticsTelemetryConsoleItem> {
    const response = await api.post('/analytics-telemetry-console/items', payload);
    return response.data.item;
  },

  async updateItem(id: string, payload: Partial<AnalyticsTelemetryConsoleItem>): Promise<AnalyticsTelemetryConsoleItem> {
    const response = await api.put(`/analytics-telemetry-console/items/${id}`, payload);
    return response.data.item;
  },

  async toggleFreeze(id: string): Promise<AnalyticsTelemetryConsoleItem> {
    const response = await api.patch(`/analytics-telemetry-console/items/${id}/freeze`);
    return response.data.item;
  },

  async reorderItems(sourceId: string, targetId: string): Promise<AnalyticsTelemetryConsoleItem[]> {
    const response = await api.post('/analytics-telemetry-console/reorder', { sourceId, targetId });
    return response.data.items;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/analytics-telemetry-console/items/${id}`);
  },

  async uploadAsset(id: string, file: File): Promise<{ item: AnalyticsTelemetryConsoleItem; fileUrl: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post(`/analytics-telemetry-console/items/${id}/upload`, formData, {
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
  }): Promise<AnalyticsTelemetryConsoleSpawn> {
    const response = await api.post('/analytics-telemetry-console/spawns', payload);
    return response.data.spawn;
  },

  async getSpawns(): Promise<AnalyticsTelemetryConsoleSpawn[]> {
    const response = await api.get('/analytics-telemetry-console/spawns');
    return response.data.spawns || [];
  }
};
