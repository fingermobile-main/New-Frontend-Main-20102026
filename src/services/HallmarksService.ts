import axios from 'axios';

export interface Hallmark {
  id: number;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'milestone' | 'artist' | 'legacy' | 'community' | 'moderator' | 'other';
  criteria: Record<string, any>;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserHallmark {
  id: number;
  userId: string;
  hallmark: Hallmark;
  awardedAt: string;
  reason?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: number;
  online: number;
  privacy: 'public' | 'private' | 'secret';
  category: string;
  avatarUrl: string;
  isJoined: boolean;
  lastActivity: string;
  owner: string;
  joinRequests?: number;
}

export interface HallmarksResponse {
  success: boolean;
  data: Hallmark[];
  count: number;
}

export interface UserHallmarksResponse {
  success: boolean;
  data: UserHallmark[];
  count: number;
}

export interface CreateHallmarkRequest {
  name: string;
  description?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category?: 'achievement' | 'milestone' | 'artist' | 'legacy' | 'community' | 'moderator' | 'other';
  criteria?: Record<string, any>;
  icon?: string;
}

export interface AwardHallmarkRequest {
  userId: string;
  hallmarkId: number;
  reason?: string;
}

export interface CheckMilestonesRequest {
  userId: string;
  metrics: {
    totalStreams?: number;
    [key: string]: any;
  };
}

class HallmarksService {
  private api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json'
    }
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

  async getAllHallmarks(filters?: Record<string, any>): Promise<HallmarksResponse> {
    try {
      const response = await this.api.get('/hallmarks', { params: filters });

      if (response.data.success || Array.isArray(response.data) || Array.isArray(response.data?.data)) {
        const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
        return {
          success: true,
          data: list,
          count: list.length
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch hallmarks');
      }
    } catch (error) {
      console.error('Error fetching hallmarks:', error);
      return {
        success: false,
        data: [],
        count: 0
      };
    }
  }

  async getHallmarkById(id: string | number): Promise<{ success: boolean; data?: Hallmark; message?: string }> {
    try {
      const response = await this.api.get(`/hallmarks/${id}`);
      return {
        success: response.data.success || true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching hallmark:', error);
      return { success: false, message: 'Failed to retrieve hallmark' };
    }
  }

  async getUserHallmarks(userId: string): Promise<UserHallmarksResponse> {
    try {
      const response = await this.api.get(`/hallmarks/user/${userId}`);

      if (response.data.success || Array.isArray(response.data?.data) || Array.isArray(response.data)) {
        const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
        return {
          success: true,
          data: list,
          count: list.length
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch user hallmarks');
      }
    } catch (error) {
      console.error('Error fetching user hallmarks:', error);
      return {
        success: false,
        data: [],
        count: 0
      };
    }
  }

  async createHallmark(request: CreateHallmarkRequest): Promise<{ success: boolean; message?: string; hallmark?: Hallmark }> {
    try {
      const response = await this.api.post('/hallmarks', request);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          hallmark: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to create hallmark');
      }
    } catch (error) {
      console.error('Error creating hallmark:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create hallmark'
      };
    }
  }

  async awardHallmark(request: AwardHallmarkRequest): Promise<{ success: boolean; message?: string; userHallmark?: UserHallmark }> {
    try {
      const response = await this.api.post('/hallmarks/award', request);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          userHallmark: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to award hallmark');
      }
    } catch (error) {
      console.error('Error awarding hallmark:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to award hallmark'
      };
    }
  }

  async checkMilestones(request: CheckMilestonesRequest): Promise<{ success: boolean; message?: string; data?: { awarded: any[]; count: number } }> {
    try {
      const response = await this.api.post('/hallmarks/check-milestones', request);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to check milestones');
      }
    } catch (error) {
      console.error('Error checking milestones:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to check milestones'
      };
    }
  }

  async getQuota(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.api.get('/hallmarks/quota');
      return {
        success: response.data.success || true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching hallmarks quota:', error);
      return { success: false, message: 'Failed to fetch hallmarks quota' };
    }
  }

  async deleteHallmark(id: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.api.delete(`/hallmarks/${id}`);
      return {
        success: response.data.success || true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error deleting hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete hallmark'
      };
    }
  }

  async warnHallmark(id: number | string, reason: string): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.api.post(`/hallmarks/${id}/warn`, { reason });
      return {
        success: response.data.success || true,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error issuing warning to hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to issue warning'
      };
    }
  }

  async suspendHallmark(id: number | string, durationDays: number, reason: string): Promise<{ success: boolean; message?: string; data?: any; remainingPins?: number }> {
    try {
      const response = await this.api.post(`/hallmarks/${id}/suspend`, { durationDays, reason });
      return {
        success: response.data.success || true,
        message: response.data.message,
        data: response.data.data,
        remainingPins: response.data.remainingPins
      };
    } catch (error: any) {
      console.error('Error suspending hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to suspend hallmark'
      };
    }
  }

  async freezeHallmark(id: number | string, reason: string): Promise<{ success: boolean; message?: string; data?: any; remainingPins?: number }> {
    try {
      const response = await this.api.post(`/hallmarks/${id}/freeze`, { reason });
      return {
        success: response.data.success || true,
        message: response.data.message,
        data: response.data.data,
        remainingPins: response.data.remainingPins
      };
    } catch (error: any) {
      console.error('Error freezing hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to freeze hallmark'
      };
    }
  }

  async unfreezeHallmark(id: number | string): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.api.post(`/hallmarks/${id}/unfreeze`);
      return {
        success: response.data.success || true,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error unfreezing hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unfreeze'
      };
    }
  }

  async unsuspendHallmark(id: number | string): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.api.post(`/hallmarks/${id}/unsuspend`);
      return {
        success: response.data.success || true,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error unsuspending hallmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unsuspend'
      };
    }
  }

  async getModerationAudit(): Promise<{ success: boolean; data?: any[]; message?: string }> {
    try {
      const response = await this.api.get('/hallmarks/moderation/audit');
      return {
        success: response.data.success || true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error fetching moderation audit:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch audit log'
      };
    }
  }
}

export const hallmarksService = new HallmarksService();
export default hallmarksService;
