import React, {} from 'react';
/**
 * Hallmark Service - Community Management
 * Handles hallmark communities, memberships, and applications
 */

import axios from 'axios';
import { api as genericApi } from './api';
import type { Hallmark } from '../types';

const HALLMARKS_API_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: HALLMARKS_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inherit token logic
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface HallmarkApplication {id: string; hallmarkId: string; applicantId: string; status: 'pending' | 'approved' | 'rejected'; applicationDate: string; requestedHallmark: { name: string; slug: string;
    logoUrl?: string;
    rules?: string; settings: { memberLimit?: number;
      permissions?: {
        canPost?: boolean;
        canInvite?: boolean;
      };
      durationMonths?: number;
      joinFee?: number;
    };
  };
}

class HallmarkService {
  async getAllHallmarks(): Promise<Hallmark[]> {
    return this.getHallmarks();
  }

  async getHallmarks(): Promise<Hallmark[]> {
    try {
      const response = await api.get('/hallmarks');
      const list = response.data?.data || response.data?.hallmarks || (Array.isArray(response.data) ? response.data : []);
      return list;
    } catch (err) {
      console.error('Failed to get hallmarks:', err);
      return [];
    }
  }

  async getHallmarkBySlug(slug: string): Promise<Hallmark> {
    try {
      const response = await api.get(`/hallmarks/${slug}`);
      return response.data?.data || response.data;
    } catch (err) {
      console.error('Failed to get hallmark by slug:', err);
      throw err;
    }
  }

  async applyForHallmark(application: Omit<HallmarkApplication, 'id' | 'status' | 'applicationDate'>): Promise<HallmarkApplication> {
    const response = await api.post('/hallmarks', {
      name: application.requestedHallmark.name,
      description: application.requestedHallmark.rules || 'Hallmark community badge',
      category: 'community',
      rarity: 'rare',
      icon: application.requestedHallmark.logoUrl
    });
    return response.data?.data || response.data;
  }

  async joinHallmark(hallmarkId: string): Promise<void> {
    await api.post(`/hallmarks/${hallmarkId}/join`);
  }

  async leaveHallmark(hallmarkId: string): Promise<void> {
    await api.post(`/hallmarks/${hallmarkId}/leave`);
  }

  async updateHallmark(hallmarkId: string, updates: Hallmark | Partial<Hallmark>): Promise<Hallmark> {
    const response = await api.patch(`/hallmarks/${hallmarkId}`, updates);
    return response.data;
  }

  async addMember(hallmarkId: string, memberId: string): Promise<void> {
    await api.post(`/hallmarks/${hallmarkId}/members`, { memberId });
  }

  async updateMemberRole(hallmarkId: string, memberId: string,
    role: string): Promise<void> {
    await api.patch(`/hallmarks/${hallmarkId}/members/${memberId}`, { role });
  }

  async startSession(hallmarkId: string, type: string,
    title: string): Promise<{
  sessionId: string; pin: string }> {
    const response = await api.post(`/hallmarks/${hallmarkId}/sessions`, { type, title });
    return response.data;
  }

  async joinSession(sessionId: string, pin: string): Promise<unknown> {
    const response = await api.post(`/sessions/${sessionId}/join`, { pin });
    return response.data;
  }

  async endSession(sessionId: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`);
  }

  async getActiveSessions(hallmarkId: string): Promise<any[]> {
    const response = await api.get(`/hallmarks/${hallmarkId}/sessions/active`);
    return response.data;
  }
}

export const hallmarkService = new HallmarkService();
