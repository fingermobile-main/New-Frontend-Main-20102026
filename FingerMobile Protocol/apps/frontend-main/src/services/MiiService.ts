import axios from 'axios';
import logger from '../utils/logger';
import { API_BASE_URL } from './api';

export interface MiiAvatar {
  id: number;
  userId: string;
  name: string;
  baseTemplate?: string;
  customization: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MiiTemplate {
  id: number;
  name: string;
  category?: string;
  description?: string;
  thumbnailUrl?: string;
  baseCustomization: Record<string, any>;
  isAvailable: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface MiiItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  rarity: string;
  isAvailable: boolean;
  requiredLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarsResponse {
  success: boolean;
  data: MiiAvatar[];
  count: number;
}

export interface TemplatesResponse {
  success: boolean;
  data: MiiTemplate[];
  count: number;
}

export interface ItemsResponse {
  success: boolean;
  data: MiiItem[];
  count: number;
}

export interface CreateAvatarRequest {
  name: string;
  baseTemplate: string;
  customization?: Record<string, any>;
}

export interface CustomizeAvatarRequest {
  customization: Record<string, any>;
}

class MiiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.api.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || sessionStorage.getItem('token')) : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAvatars(): Promise<AvatarsResponse> {
    try {
      const response = await this.api.get('/mii/avatars');

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          count: response.data.count
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch avatars');
      }
    } catch (error) {
      logger.error('Error fetching avatars:', error);
      return {
        success: false,
        data: [],
        count: 0
      };
    }
  }

  async createAvatar(request: CreateAvatarRequest): Promise<{ success: boolean; message?: string; data?: MiiAvatar }> {
    try {
      const response = await this.api.post('/mii/avatars', request);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to create avatar');
      }
    } catch (error) {
      logger.error('Error creating avatar:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create avatar'
      };
    }
  }

  async customizeAvatar(avatarId: number, request: CustomizeAvatarRequest): Promise<{ success: boolean; message?: string; data?: MiiAvatar }> {
    try {
      const response = await this.api.put(`/mii/avatars/${avatarId}/customize`, request);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to customize avatar');
      }
    } catch (error) {
      logger.error('Error customizing avatar:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to customize avatar'
      };
    }
  }

  async getTemplates(filters?: Record<string, any>): Promise<TemplatesResponse> {
    try {
      const response = await this.api.get('/mii/templates', { params: filters });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          count: response.data.count
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch templates');
      }
    } catch (error) {
      logger.error('Error fetching templates:', error);
      return {
        success: false,
        data: [],
        count: 0
      };
    }
  }

  async getItems(filters?: Record<string, any>): Promise<ItemsResponse> {
    try {
      const response = await this.api.get('/mii/items', { params: filters });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          count: response.data.count
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch items');
      }
    } catch (error) {
      logger.error('Error fetching items:', error);
      return {
        success: false,
        data: [],
        count: 0
      };
    }
  }
}

export const miiService = new MiiService();
export default miiService;
