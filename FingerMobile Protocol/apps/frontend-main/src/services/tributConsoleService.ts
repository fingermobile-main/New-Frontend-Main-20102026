/**
 * Tribut Sovereign Operations & Showcase Console Service
 * FingerMobile Protocol™ Zero Error Margin
 */

import axios from 'axios';
import {
  TributConsolePin,
  TributConsoleOverview,
  TributMediaUploadItem,
  CreateTributPinPayload,
  TributProjectBoardItem
} from '../types/tributConsole';

const API_BASE = '/api/tribut';

export const tributConsoleService = {
  async getOverview(): Promise<TributConsoleOverview> {
    const res = await axios.get(`${API_BASE}/overview`);
    return res.data.data;
  },

  async getPins(params?: {
    category?: string;
    status?: string;
    search?: string;
    priority?: string;
  }): Promise<TributConsolePin[]> {
    const res = await axios.get(`${API_BASE}/admin/pins`, { params });
    return res.data.data;
  },

  async createPin(payload: CreateTributPinPayload): Promise<TributConsolePin> {
    const res = await axios.post(`${API_BASE}/pins`, payload);
    return res.data.data;
  },

  async updatePin(id: string, payload: Partial<CreateTributPinPayload>): Promise<TributConsolePin> {
    const res = await axios.put(`${API_BASE}/pins/${id}`, payload);
    return res.data.data;
  },

  async deletePin(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/pins/${id}`);
  },

  async batchDeletePins(ids: string[]): Promise<void> {
    await axios.delete(`${API_BASE}/pins/batch`, { data: { ids } });
  },

  async toggleFreeze(id: string): Promise<TributConsolePin> {
    const res = await axios.patch(`${API_BASE}/pins/${id}/freeze`);
    return res.data.data;
  },

  async toggleCensor(id: string): Promise<TributConsolePin> {
    const res = await axios.patch(`${API_BASE}/pins/${id}/censor`);
    return res.data.data;
  },

  async toggleSuspend(id: string): Promise<TributConsolePin> {
    const res = await axios.patch(`${API_BASE}/pins/${id}/suspend`);
    return res.data.data;
  },

  async togglePauseComments(id: string): Promise<TributConsolePin> {
    const res = await axios.patch(`${API_BASE}/pins/${id}/pause-comments`);
    return res.data.data;
  },

  async reportPin(id: string, reason?: string): Promise<TributConsolePin> {
    const res = await axios.post(`${API_BASE}/pins/${id}/report`, { reason });
    return res.data.data;
  },

  async togglePinStatus(id: string, isPinned?: boolean): Promise<TributConsolePin> {
    const res = await axios.patch(`${API_BASE}/pins/${id}/pin-status`, { isPinned });
    return res.data.data;
  },

  async reorderPins(sourceId: string, targetId: string): Promise<TributConsolePin[]> {
    const res = await axios.post(`${API_BASE}/pins/reorder`, { sourceId, targetId });
    return res.data.data;
  },

  async uploadSingleMedia(
    file: File,
    deviceMetadata?: { deviceType?: string; devicePlatform?: string; deviceName?: string }
  ): Promise<{ file_url: string; original_name: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (deviceMetadata?.deviceType) formData.append('deviceType', deviceMetadata.deviceType);
    if (deviceMetadata?.devicePlatform) formData.append('devicePlatform', deviceMetadata.devicePlatform);
    if (deviceMetadata?.deviceName) formData.append('deviceName', deviceMetadata.deviceName);

    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
    return {
      file_url: data?.file_url || res.data.urls?.[0] || '',
      original_name: data?.original_name || file.name
    };
  },

  async uploadMediaPack(
    pack: { images?: File[]; cover?: File | null; video?: File | null },
    deviceMetadata?: { deviceType?: string; devicePlatform?: string; deviceName?: string }
  ): Promise<{ images: string[]; cover: string | null; videos: string[] }> {
    const formData = new FormData();

    if (pack.cover) {
      formData.append('cover', pack.cover);
    }
    if (pack.images && pack.images.length > 0) {
      pack.images.forEach(img => formData.append('images', img));
    }
    if (pack.video) {
      formData.append('video', pack.video);
    }

    if (deviceMetadata?.deviceType) formData.append('deviceType', deviceMetadata.deviceType);
    if (deviceMetadata?.devicePlatform) formData.append('devicePlatform', deviceMetadata.devicePlatform);
    if (deviceMetadata?.deviceName) formData.append('deviceName', deviceMetadata.deviceName);

    const res = await axios.post(`${API_BASE}/upload-pack`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },

  async getUploads(params?: { deviceType?: string; status?: string }): Promise<TributMediaUploadItem[]> {
    const res = await axios.get(`${API_BASE}/uploads`, { params });
    return res.data.data;
  },

  async getBoards(): Promise<TributProjectBoardItem[]> {
    // Boards can be fetched from /api/master-dashboard/media/tribut-uploads or fallback
    try {
      const res = await axios.get('/api/tribut/boards');
      return res.data.data;
    } catch {
      return [];
    }
  }
};
