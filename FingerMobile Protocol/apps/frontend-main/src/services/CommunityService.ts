import React, {} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';

export interface Community {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  members: number;
  posts: number;
  category: string;
  isPrivate: boolean;
  isJoined?: boolean;
  createdAt: string;
}

export interface CreateCommunityData {
  name: string;
  description?: string;
  category: string;
  isPrivate?: boolean;
  avatar?: File;
  coverImage?: File;
}

class CommunityService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/communities`,
    headers: { 'Content-Type': 'application/json' }
  });

  constructor() {
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getCommunities(category?: string, limit: number = 20): Promise<Community[]> {
    try {
      const response = await this.api.get('/', { params: { category, limit } });
      const raw = response.data?.data || response.data?.communities || response.data;
      return Array.isArray(raw) ? raw : [];
    } catch (err) {
      console.error('Error fetching communities:', err);
      return [];
    }
  }

  async getCommunityById(communityId: string): Promise<Community> {
    const response = await this.api.get(`/${communityId}`);
    return response.data?.data || response.data;
  }

  async createCommunity(data: CreateCommunityData): Promise<Community> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    if (data.description) formData.append('description', data.description);
    if (data.isPrivate) formData.append('isPrivate', 'true');
    if (data.avatar) formData.append('avatar', data.avatar);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await this.api.post('/', formData, {headers: { 'Content-Type': 'multipart/form-data'
    }
    });
    return response.data;
  }

  async updateCommunity(communityId: string, updates: Partial<CreateCommunityData>): Promise<Community> {
    const response = await this.api.put(`/${communityId}`, updates);
    return response.data;
  }

  async deleteCommunity(communityId: string): Promise<void> {
    await this.api.delete(`/${communityId}`);
  }

  async joinCommunity(communityId: string): Promise<void> {
    await this.api.post(`/${communityId}/join`);
  }

  async leaveCommunity(communityId: string): Promise<void> {
    await this.api.post(`/${communityId}/leave`);
  }

  async getCommunityMembers(communityId: string, limit: number = 20): Promise<any[]> {
    const response = await this.api.get(`/${communityId}/members`, {
      params: { limit } });
    return response.data;
  }

  async getCommunityPosts(communityId: string, limit: number = 20): Promise<any[]> {
    const response = await this.api.get(`/${communityId}/posts`, {
      params: { limit } });
    return response.data;
  }

  async searchCommunities(query: string, limit: number = 10): Promise<Community[]> {
    const response = await this.api.get('/search', {params: { query,
      limit } });
    return response.data;
  }

  async getTrendingCommunities(limit: number = 10): Promise<Community[]> {
    const response = await this.api.get('/trending', {
      params: { limit } });
    return response.data;
  }

  async getUserCommunities(userId: string): Promise<Community[]> {
    const response = await this.api.get(`/user/${userId}`);
    return response.data;
  }
}

export const communityService = new CommunityService();
export default communityService;
