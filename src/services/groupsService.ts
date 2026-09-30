import axios, { AxiosInstance } from 'axios';

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

export interface CreateGroupRequest {
  name: string;
  description?: string;
  category: string;
  privacy: 'public' | 'private' | 'secret';
  isModerated: boolean;
}

export interface GroupResponse {
  success: boolean;
  data?: Group;
  message?: string;
}

export interface GroupsResponse {
  success: boolean;
  data: Group[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

export interface GroupMember {
  id: string;
  username: string;
  avatarUrl: string;
  role: 'member' | 'admin' | 'owner';
  joinedAt: string;
  lastActive: string;
  isOnline: boolean;
}

class GroupsService {
  private api: AxiosInstance;

  constructor() {
    const defaultApiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.api = axios.create({
      baseURL: process.env.REACT_APP_GROUPS_API_URL || `${defaultApiUrl}/groups`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Inherit token logic with standard app keys
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAllGroups(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string; 
    privacy?: string 
  }): Promise<GroupsResponse & { groups?: Group[] }> {
    try {
      const response = await this.api.get('', { params });
      
      if (response.data.success || Array.isArray(response.data) || Array.isArray(response.data?.data)) {
        const rawList = Array.isArray(response.data) ? response.data : (response.data.data || response.data.groups || []);
        return {
          success: true,
          data: rawList,
          groups: rawList,
          pagination: response.data.pagination,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      return {
        success: false,
        data: [],
        groups: [],
        message: error instanceof Error ? error.message : 'Failed to fetch groups'
      };
    }
  }

  async getGroups(params?: any): Promise<GroupsResponse & { groups?: Group[] }> {
    return this.getAllGroups(params);
  }

  async getGroupById(groupId: string): Promise<GroupResponse & { group?: Group }> {
    try {
      const response = await this.api.get(`/${groupId}`);
      
      if (response.data.success || response.data.data || response.data.group) {
        const groupData = response.data.data || response.data.group || response.data;
        return {
          success: true,
          data: groupData,
          group: groupData,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch group');
      }
    } catch (error) {
      console.error('Error fetching group:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch group'
      };
    }
  }

  async createGroup(request: CreateGroupRequest): Promise<GroupResponse> {
    try {
      const response = await this.api.post('', request);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      return {
        success: false,
        data: {} as Group,
        message: error instanceof Error ? error.message : 'Failed to create group'
      };
    }
  }

  async updateGroup(groupId: string, updates: Partial<CreateGroupRequest>): Promise<GroupResponse> {
    try {
      const response = await this.api.put(`/${groupId}`, updates);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to update group');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      return {
        success: false,
        data: {} as Group,
        message: error instanceof Error ? error.message : 'Failed to update group'
      };
    }
  }

  async deleteGroup(groupId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.api.delete(`/${groupId}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete group'
      };
    }
  }

  async joinGroup(groupId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.api.post(`/${groupId}/join`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to join group');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to join group'
      };
    }
  }

  async leaveGroup(groupId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.api.post(`/${groupId}/leave`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to leave group'
      };
    }
  }

  async getGroupMembers(groupId: string): Promise<{ success: boolean; data?: GroupMember[]; members?: GroupMember[]; message?: string }> {
    try {
      const response = await this.api.get(`/${groupId}/members`);
      
      if (response.data.success || response.data.data || response.data.members) {
        const memberList = response.data.data || response.data.members || [];
        return {
          success: true,
          data: memberList,
          members: memberList,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch group members');
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      return {
        success: false,
        data: [],
        members: [],
        message: error instanceof Error ? error.message : 'Failed to fetch group members'
      };
    }
  }

  async getGroupStats(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.api.get('/stats');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch group stats');
      }
    } catch (error) {
      console.error('Error fetching group stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch group stats'
      };
    }
  }
}

export const groupsService = new GroupsService();
export default groupsService;
