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
}

export const hallmarksService = new HallmarksService();
export default hallmarksService;