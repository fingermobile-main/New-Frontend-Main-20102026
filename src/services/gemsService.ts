import axios from 'axios';

export interface GemItem {
  id: string | number;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  creator: string;
  likes: number;
  thumbnail: string;
  image_url?: string;
  privacy_type?: 'public' | 'private_visible' | 'secret' | string;
}

export interface GemsResponse {
  success: boolean;
  data: GemItem[];
  total: number;
  limit: number;
  offset: number;
}

class GemsService {
  private api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.api.interceptors.request.use((config) => {
      const token =
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('fingermobile_token') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getGems(limit: number = 20, offset: number = 0): Promise<GemsResponse> {
    try {
      // First attempt fetching store items from /gems
      const response = await this.api.get('/gems', {
        params: { limit, offset }
      });

      const rawItems = response.data?.data || response.data?.gems || (Array.isArray(response.data) ? response.data : null);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = rawItems.map((item: any, index: number) => ({
          id: String(item.id || `gem-${index}`),
          title: item.title || item.name || `Gem Item #${item.id || index}`,
          description: item.description || 'Exclusive FingerMobile Gem item',
          price: Number(item.price || item.cost || 100),
          category: item.category || 'Collectibles',
          rating: Number(item.rating || 4.8),
          creator: item.creator || 'FingerMobile Protocol™',
          likes: Number(item.likes || 0),
          thumbnail: item.image_url || item.thumbnail || item.icon || '/thumbnails/default-gem.jpg',
          image_url: item.image_url || item.thumbnail || '',
          privacy_type: item.privacy_type || 'public'
        }));

        return {
          success: true,
          data: items,
          total: response.data?.total || items.length,
          limit,
          offset
        };
      }

      // Fallback to transactions if /gems returns empty
      const txResponse = await this.api.get('/gems/transactions', {
        params: { limit, offset }
      });

      if (txResponse.data && txResponse.data.data && txResponse.data.data.transactions) {
        const gems = txResponse.data.data.transactions.map((transaction: any, index: number) => ({
          id: String(transaction.id || `gem-${index}`),
          title: transaction.description || `Gem Transaction #${transaction.id}`,
          description: `Gems transaction of ${transaction.amount} for ${transaction.type}`,
          price: transaction.amount || 0,
          category: transaction.type || 'General',
          rating: 4.5,
          creator: 'System',
          likes: 0,
          thumbnail: '/thumbnails/default-gem.jpg'
        }));

        return {
          success: true,
          data: gems,
          total: txResponse.data.data.total || gems.length,
          limit: txResponse.data.data.limit || limit,
          offset: txResponse.data.data.offset || offset
        };
      }

      return {
        success: true,
        data: [],
        total: 0,
        limit,
        offset
      };
    } catch (error) {
      console.error('Error fetching gems:', error);
      return {
        success: false,
        data: [],
        total: 0,
        limit,
        offset
      };
    }
  }

  async getGemBalance(userId?: string | number): Promise<{ success: boolean; balance: number }> {
    try {
      const endpoint = userId ? `/gems/balance/${userId}` : '/gems/balance';
      const response = await this.api.get(endpoint);

      if (response.data && response.data.data) {
        return {
          success: true,
          balance: response.data.data.balance || 0
        };
      }

      return {
        success: false,
        balance: 0
      };
    } catch (error) {
      console.error('Error fetching gem balance:', error);
      return {
        success: false,
        balance: 0
      };
    }
  }

  async awardGems(userId: string | number, amount: number, reason?: string): Promise<{ success: boolean; newBalance?: number; message?: string }> {
    try {
      const response = await this.api.post('/gems/award', { userId, amount, reason });
      return {
        success: response.data.success,
        newBalance: response.data.newBalance,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error awarding gems:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to award gems'
      };
    }
  }

  async deductGems(userId: string | number, amount: number, reason?: string): Promise<{ success: boolean; newBalance?: number; message?: string }> {
    try {
      const response = await this.api.post('/gems/deduct', { userId, amount, reason });
      return {
        success: response.data.success,
        newBalance: response.data.newBalance,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deducting gems:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to deduct gems'
      };
    }
  }

  async redeemItem(itemId: string | number): Promise<{ success: boolean; message: string; newBalance?: number; item?: any }> {
    try {
      const response = await this.api.post('/gems/redeem', { itemId });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to redeem gem item'
      };
    }
  }

  async getBroadcastFeed(): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await this.api.get('/gems/broadcast/feed');
      return response.data;
    } catch (error: any) {
      return { success: false, data: [] };
    }
  }

  async postBroadcast(contentText: string, mediaUrls: string[] = []): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await this.api.post('/gems/broadcast', { contentText, mediaUrls });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to post Gems broadcast'
      };
    }
  }

  async purchaseGems(
    gemAmount: number,
    costFic: number,
    packName: string = 'Gem Pack',
    paymentMethod: string = 'FIC'
  ): Promise<{ success: boolean; message: string; newBalance?: number; data?: any }> {
    try {
      const response = await this.api.post('/gems/purchase', {
        gemAmount,
        costFic,
        packName,
        paymentMethod
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to complete gem purchase'
      };
    }
  }

  async searchGems(query: string, limit: number = 20, offset: number = 0): Promise<GemsResponse> {
    try {
      // For now, we'll just fetch all gems and filter on the frontend
      // In a real implementation, this would be a dedicated search endpoint
      return await this.getGems(limit, offset);
    } catch (error) {
      console.error('Error searching gems:', error);
      return {
        success: false,
        data: [],
        total: 0,
        limit,
        offset
      };
    }
  }
}

export const gemsService = new GemsService();
export default gemsService;
