/**
 * Communications, WebRTC & VoIP Console Service
 * FingerMobile Protocol™ Production Control Plane
 * Phase 13: Direct API client using api axios instance with direct PostgreSQL persistence
 */

import api from './api';
import {
  CommsVoipOverview,
  CommsVoipRoomItem,
  CommsVoipItem,
  CommsVoipSpawnedConsole,
  CommsVoipSpawn,
  CreateVoipRoomPayload,
  CreateCommsVoipPayload,
  UpdateVoipRoomPayload
} from '../types/commsVoipConsole';

export const commsVoipConsoleService = {
  getOverview: async (): Promise<CommsVoipOverview> => {
    const response = await api.get('/comms-voip-console/overview');
    return response.data.data;
  },

  getItems: async (): Promise<CommsVoipRoomItem[]> => {
    const response = await api.get('/comms-voip-console/items');
    return response.data.data;
  },

  createItem: async (payload: CreateVoipRoomPayload): Promise<CommsVoipRoomItem> => {
    const response = await api.post('/comms-voip-console/items', payload);
    return response.data.data;
  },

  updateItem: async (id: number, payload: UpdateVoipRoomPayload): Promise<CommsVoipRoomItem> => {
    const response = await api.put(`/comms-voip-console/items/${id}`, payload);
    return response.data.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/comms-voip-console/items/${id}`);
  },

  reorderItems: async (items: { id: number; display_order: number }[]): Promise<CommsVoipRoomItem[]> => {
    const response = await api.post('/comms-voip-console/reorder', { items });
    return response.data.data;
  },

  toggleDefcon: async (enableKillswitch: boolean): Promise<CommsVoipRoomItem[]> => {
    const response = await api.post('/comms-voip-console/defcon-toggle', {
      enable_killswitch: enableKillswitch
    });
    return response.data.data;
  },

  uploadAsset: async (file: File, roomId?: number): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('asset', file);
    if (roomId) {
      formData.append('room_id', roomId.toString());
    }
    const response = await api.post('/comms-voip-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  getSpawns: async (): Promise<CommsVoipSpawnedConsole[]> => {
    const response = await api.get('/comms-voip-console/spawns');
    return response.data.data;
  },

  createSpawn: async (payload: {
    title: string;
    domain: string;
    badge: string;
    description: string;
    active_instances?: number;
  }): Promise<CommsVoipSpawnedConsole> => {
    const response = await api.post('/comms-voip-console/spawns', payload);
    return response.data.data;
  }
};

export default commsVoipConsoleService;
