import React, {} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';

export interface Notification {id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notifyOnLike: boolean;
  notifyOnComment: boolean;
  notifyOnFollow: boolean;
  notifyOnMention: boolean;
  notifyOnMessage: boolean;
}

class NotificationService {
  private api = axios.create({baseURL: API_BASE_URL, headers: {
    'Content-Type': 'application/json'
  }
  });

  async getNotifications(limit: number = 20, offset: number = 0): Promise<Notification[]> {
    const response = await this.api.get('/', {params: { limit,
      offset } });
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.api.get('/unread/count');
    return response.data.count;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.api.put(`/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await this.api.put('/read-all');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.api.delete(`/${notificationId}`);
  }

  async clearAllNotifications(): Promise<void> {
    await this.api.delete('/all');
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await this.api.get('/preferences');
    return response.data;
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await this.api.put('/preferences', preferences);
    return response.data;
  }

  async sendNotification(userId: string, type: string, title: string, message: string, data?: unknown): Promise<Notification> {
    const response = await this.api.post('/send', { userId, type, title, message, data });
    return response.data;
  }

  async getNotificationHistory(period: string = '30d'): Promise<Notification[]> {
    const response = await this.api.get('/history', {params: { period } });
    return response.data;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
