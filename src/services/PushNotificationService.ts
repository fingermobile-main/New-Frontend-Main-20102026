import React, {} from 'react';
/* eslint-disable no-console */
import { messaging, getToken, onMessage } from '../config/firebase';
import { api } from './api';

export interface PushNotificationData {title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  [ key: string]: unknown;
}

class PushNotificationService {
  /**
   * Request permission and get FCM token
   */
  async requestPermission(): Promise<string | null> {
    if (!messaging) {
      console.info('Firebase messaging not initialized');
      return null;
    }
    try {
      // Request permission from the user
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.info('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (token) {
        console.info('FCM Token:', token);
        // Register token with backend
        await this.registerToken(token);
        return token;
      } else {
        console.info('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Register device token with backend
   */
  async registerToken(
    token: string): Promise<void> {
    try {
      const platform = this.getPlatform();
      const deviceId = this.getDeviceId();

      await api.post('/notifications/register-device', {deviceToken: token,
        platform, deviceId
      });

      console.info('Device token registered successfully');
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  }

  /**
   * Listen for foreground messages
   */
  onMessageReceived(
    callback: (
  payload: Record<string, unknown>) => void): void {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.info('Message received in foreground:', payload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(payload as any);
    });
  }

  /**
   * Unregister current device token
   */
  async unregisterToken(): Promise<void> {
    if (!messaging) return;
    try {
      const token = await getToken(messaging);
      if (token) {
        await api.post('/notifications/unregister-device', {deviceToken: token
        });
        console.info('Device token unregistered');
      }
    } catch (error) {
      console.error('Error unregistering device token:', error);
    }
  }

  /**
   * Get current platform
   */
  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      return 'android';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else {
      return 'web';
    }
  }

  /**
   * Generate or retrieve device ID
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = this.generateUUID();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Generate UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
