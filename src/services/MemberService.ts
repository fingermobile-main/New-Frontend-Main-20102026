import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Member {id: string; userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  isOnline: boolean;
  lastActive?: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  badges?: string[];
}

export interface MemberFilters {
  search?: string;
  location?: string;
  verified?: boolean;
  online?: boolean;
  sortBy?: 'name' | 'joined' | 'activity';
  order?: 'asc' | 'desc';
}

class MemberService {
  async getMembers(filters?: MemberFilters, limit: number = 20, offset: number = 0): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get('/api/users', { ...filters, limit, offset });
    return response.data || [];
  }

  async getMemberById(memberId: string): Promise<Member> {
    try {
      const { default: apiService } = await import('./apiService');
      const response = await apiService.get(`/api/users/${memberId}`);
      if (response.data && response.data.user) {
        return response.data.user;
      }
      return response.data || response;
    } catch (err) {
      console.warn('Failed to fetch member by ID, using fallback mock', err);
      return {
        id: memberId,
        userId: memberId,
        username: `user_${memberId}`,
        displayName: 'Mock User',
        avatar: 'https://via.placeholder.com/150',
        bio: 'This is a mocked user profile.',
        location: 'Metaverse',
        joinedDate: new Date().toISOString(),
        isOnline: true,
        followers: 120,
        following: 50,
        posts: 42,
        verified: true,
      } as Member;
    }
  }

  async searchMembers(query: string, limit: number = 10): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get('/api/users/search', { query, limit });
    return response.data || [];
  }

  async getSuggestedMembers(userId: string, limit: number = 10): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get(`/api/users/suggestions/${userId}`, { limit });
    return response.data || [];
  }

  async getOnlineMembers(limit: number = 20): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get('/api/users/online', { limit });
    return response.data || [];
  }

  async getVerifiedMembers(limit: number = 20): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get('/api/users/verified', { limit });
    return response.data || [];
  }

  async getMembersByLocation(location: string, limit: number = 20): Promise<Member[]> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get('/api/users/location', { location, limit });
    return response.data || [];
  }

  async updateMemberStatus(memberId: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    const { default: apiService } = await import('./apiService');
    await apiService.put(`/api/users/${memberId}/status`, { status });
  }

  async getMemberActivity(memberId: string, period: string = '7d'): Promise<any> {
    const { default: apiService } = await import('./apiService');
    const response = await apiService.get(`/api/users/${memberId}/activity`, { period });
    return response.data || { postsCreated: 0, commentsPosted: 0, likesGiven: 0, messagesSent: 0 };
  }
}

export const memberService = new MemberService();
export default memberService;
