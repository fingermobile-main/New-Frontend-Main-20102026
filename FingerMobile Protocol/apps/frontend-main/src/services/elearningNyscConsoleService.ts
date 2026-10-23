import { api } from './api';
import {
  ElearningNyscDomain,
  ElearningNyscItem,
  ElearningNyscOverview,
  ElearningNyscSpawnedConsole,
  CreateElearningNyscItemPayload
} from '../types/elearningNyscConsole';

export interface ReorderEntry {
  id: string | number;
  display_order: number;
}

export const elearningNyscConsoleService = {
  /**
   * Fetch overarching E-Learning & NYSC EduTech metrics
   */
  async getOverview(): Promise<ElearningNyscOverview> {
    const response = await api.get('/elearning-nysc-console/overview');
    return response.data.data;
  },

  /**
   * Fetch course items (optionally filtered by domain)
   */
  async getItems(domain?: ElearningNyscDomain | 'all', search?: string, status?: string): Promise<ElearningNyscItem[]> {
    const params: Record<string, string> = {};
    if (domain && domain !== 'all') params.domain = domain;
    if (search && search.trim()) params.search = search.trim();
    if (status && status !== 'all') params.status = status;
    const response = await api.get('/elearning-nysc-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new course syllabus or accreditation node
   */
  async createItem(payload: CreateElearningNyscItemPayload): Promise<ElearningNyscItem> {
    const response = await api.post('/elearning-nysc-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing course or accreditation record
   */
  async updateItem(id: string | number, payload: Partial<ElearningNyscItem>): Promise<ElearningNyscItem> {
    const response = await api.put(`/elearning-nysc-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Delete an existing course item
   */
  async deleteItem(id: string | number): Promise<void> {
    await api.delete(`/elearning-nysc-console/items/${id}`);
  },

  /**
   * Toggle freeze / unfreeze status on a course
   */
  async toggleFreeze(id: string | number): Promise<ElearningNyscItem> {
    const response = await api.patch(`/elearning-nysc-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder course items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/elearning-nysc-console/reorder', { orders });
  },

  /**
   * Upload syllabus, educator credentials, or accreditation proof
   */
  async uploadMedia(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const response = await api.post('/elearning-nysc-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  /**
   * Fetch spawned EduTech consoles
   */
  async getSpawnedConsoles(): Promise<ElearningNyscSpawnedConsole[]> {
    const response = await api.get('/elearning-nysc-console/spawns');
    return response.data.data || [];
  },

  /**
   * Spawn a new specialized EduTech sub-console
   */
  async spawnConsole(payload: { title: string; domain: string; badge: string; description?: string }): Promise<ElearningNyscSpawnedConsole> {
    const response = await api.post('/elearning-nysc-console/spawns', payload);
    return response.data.data;
  }
};

export default elearningNyscConsoleService;
