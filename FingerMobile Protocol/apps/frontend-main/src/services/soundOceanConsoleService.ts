/**
 * SoundOcean Sovereign Library Console Service
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import axios from 'axios';
import {
  SoundOceanItem,
  SoundOceanOverview,
  SoundOceanSpawn,
  CreateSoundOceanPayload
} from '../types/soundOceanConsole';

const API_BASE = '/api/sound-ocean-console';

export const soundOceanConsoleService = {
  async getOverview(): Promise<SoundOceanOverview> {
    const res = await axios.get(`${API_BASE}/overview`);
    return res.data.data;
  },

  async getItems(params?: { category?: string; status?: string; search?: string; genre?: string }): Promise<SoundOceanItem[]> {
    const res = await axios.get(`${API_BASE}/items`, { params });
    return res.data.data;
  },

  async getItemById(id: number): Promise<SoundOceanItem> {
    const res = await axios.get(`${API_BASE}/items/${id}`);
    return res.data.data;
  },

  async createItem(payload: CreateSoundOceanPayload): Promise<SoundOceanItem> {
    const res = await axios.post(`${API_BASE}/items`, payload);
    return res.data.data;
  },

  async updateItem(id: number, payload: Partial<CreateSoundOceanPayload>): Promise<SoundOceanItem> {
    const res = await axios.put(`${API_BASE}/items/${id}`, payload);
    return res.data.data;
  },

  async deleteItem(id: number): Promise<{ id: string }> {
    const res = await axios.delete(`${API_BASE}/items/${id}`);
    return res.data;
  },

  async toggleFreeze(id: number): Promise<SoundOceanItem> {
    const res = await axios.patch(`${API_BASE}/items/${id}/freeze`);
    return res.data.data;
  },

  async reorderItems(sourceId: number, targetId: number): Promise<SoundOceanItem[]> {
    const res = await axios.post(`${API_BASE}/reorder`, { sourceId, targetId });
    return res.data.data;
  },

  async uploadAsset(id: number | null, file: File): Promise<{ asset_url: string; filename: string }> {
    const formData = new FormData();
    formData.append('asset', file);
    const url = id ? `${API_BASE}/items/${id}/upload` : `${API_BASE}/upload`;
    const res = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async getSpawns(): Promise<SoundOceanSpawn[]> {
    const res = await axios.get(`${API_BASE}/spawns`);
    return res.data.data;
  },

  async createSpawn(payload: { sub_console_name: string; slug: string; endpoint: string; category?: string }): Promise<SoundOceanSpawn> {
    const res = await axios.post(`${API_BASE}/spawns`, payload);
    return res.data.data;
  },

  async spawnSubConsole(payload: { sub_console_name: string; slug: string; endpoint: string; category?: string }): Promise<SoundOceanSpawn> {
    return this.createSpawn(payload);
  }
};
