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
  sortBy?: "name" | "joined" | "activity";
  order?: "asc" | "desc";
}

class MemberService {
  private api = axios.create({baseURL: ``,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async getMembers(filters?: MemberFilters,
limit: number = 20,
offset: number = 0): Promise<Member[]> {
    const response = await this.api.get('/', {params: { ...filters,
  limit,
  offset } });
    return response.data;
  }

  async getMemberById(memberId: string): Promise<Member> {
    const response = await this.api.get(`/${memberId}`);
    return response.data;
  }

  async searchMembers(query: string, limit: number = 10): Promise<Member[]> {
    const response = await this.api.get('/search', {params: { query,
  limit } });
    return response.data;
  }

  async getSuggestedMembers(userId: string, limit: number = 10): Promise<Member[]> {
    const response = await this.api.get(`/suggestions/${userId}`, {params: { limit } });
    return response.data;
  }

  async getOnlineMembers(limit: number = 20): Promise<Member[]> {
    const response = await this.api.get('/online', {params: { limit } });
    return response.data;
  }

  async getVerifiedMembers(limit: number = 20): Promise<Member[]> {
    const response = await this.api.get('/verified', {params: { limit } });
    return response.data;
  }

  async getMembersByLocation(location: string, limit: number = 20): Promise<Member[]> {
    const response = await this.api.get('/location', {params: { location,
  limit } });
    return response.data;
  }

  async updateMemberStatus(memberId: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    await this.api.put(`/${memberId}/status`, { status });
  }

  async getMemberActivity(memberId: string, period: string = '7d'): Promise<{postsCreated: number;
  commentsPosted: number;
  likesGiven: number;
  messagesSent: number;
  }> {
    const response = await this.api.get(`/${memberId}/activity`, {params: { period } });
    return response.data;
  }

  // Added based on integration test requirement
  async getTrendingMembers(limit: number = 10): Promise<Member[]> {
    const response = await this.api.get('/trending', { params: { limit } });
    return response.data;
  }
}

export const memberService = new MemberService();
export default memberService;
