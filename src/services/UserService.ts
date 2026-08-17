import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface UserProfile {id: string; userId: string; username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  followers: number; following: number;
  posts: number; verified: boolean;
  createdAt: string; updatedAt: string;
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: File;
  coverImage?: File;
}

class UserService {
  private api = axios.create({baseURL: `${API_BASE_URL}/discover`, headers: {
      'Content-Type': 'application/json'
    }
  });

  async getProfile(userId: string): Promise<UserProfile> {
    const response = await this.api.get(`/profile/${userId}`);
    return response.data;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    const formData = new FormData();
    if (data.displayName) formData.append('displayName', data.displayName);
    if (data.bio) formData.append('bio', data.bio);
    if (data.location) formData.append('location', data.location);
    if (data.website) formData.append('website', data.website);
    if (data.avatar) formData.append('avatar', data.avatar);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await this.api.put(`/profile/${userId}`, formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async followUser(userId: string): Promise<void> {
    await this.api.post(`/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await this.api.delete(`/follow/${userId}`);
  }

  async getFollowers(userId: string, limit: number = 20): Promise<UserProfile[]> {
    const response = await this.api.get(`/followers/${userId}`, {params: { limit } });
    return response.data;
  }

  async getFollowing(userId: string, limit: number = 20): Promise<UserProfile[]> {
    const response = await this.api.get(`/following/${userId}`, {params: { limit } });
    return response.data;
  }

  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    const response = await this.api.get('/search', {params: { query,
  limit } });
    return response.data;
  }

  async getSuggestedUsers(limit: number = 10): Promise<UserProfile[]> {
    const response = await this.api.get('/suggestions', {params: { limit } });
    return response.data;
  }

  async blockUser(userId: string): Promise<void> {
    await this.api.post(`/block/${userId}`);
  }

  async unblockUser(userId: string): Promise<void> {
    await this.api.delete(`/block/${userId}`);
  }

  async reportUser(userId: string, reason: string): Promise<void> {
    await this.api.post(`/report/${userId}`, { reason });
  }
}

export const userService = new UserService();
export default userService;
