import React, {} from 'react';
import { api } from './api';
import { PublishingSettings } from '../components/posts/PostPublishingSettings';

class PostPublishingService {
  async saveSettings(
    postId: string,
    settings: PublishingSettings) {
    try {
      const response = await api.put(`/posts/${postId}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error saving publishing, settings:', error);
      return {
        success: false, message: 'Failed to save settings' };
    }
  }

  async getSettings(
    postId: string) {
    try {
      const response = await api.get(`/posts/${postId}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching publishing, settings:', error);
      return null;
    }
  }

  async applyAIRecommendations(
    content: string, memberId: string) {
    try {
      const response = await api.post('/ai/recommendations', {
        content, memberId
      });
      return response.data;
    } catch (error) {
      console.error('Error applying AI, recommendations:', error);
      return null;
    }
  }

  async schedulePost(
    postId: string, scheduleTime: Date) {
    try {
      const response = await api.post(`/posts/${postId}/schedule`, {scheduleTime: scheduleTime.toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling, post:', error);
      return {
        success: false, message: 'Failed to schedule post' };
    }
  }

  async enableMonetization(
    postId: string, model: string, price?: number) {
    try {
      const response = await api.post(`/posts/${postId}/monetize`, {
        model, price
      });
      return response.data;
    } catch (error) {
      console.error('Error enabling, monetization:', error);
      return {
        success: false, message: 'Failed to enable monetization' };
    }
  }

  async boostPost(
    postId: string, boostConfig: Record<string, unknown>) {
    try {
      const response = await api.post(`/posts/${postId}/boost`, boostConfig);
      return response.data;
    } catch (error) {
      console.error('Error boosting, post:', error);
      return {
        success: false, message: 'Failed to boost post' };
    }
  }

  async addCollaborators(
    postId: string, collaborators: string[]) {
    try {
      const response = await api.post(`/posts/${postId}/collaborators`, {
        collaborators
      });
      return response.data;
    } catch (error) {
      console.error('Error adding, collaborators:', error);
      return {
        success: false, message: 'Failed to add collaborators' };
    }
  }

  async validateSettings(
    settings: PublishingSettings) {
    try {
      const response = await api.post('/posts/settings/validate', settings);
      return response.data;
    } catch (error) {
      console.error('Error validating, settings:', error);
      return {isValid: false, errors: ['Failed to validate settings']
      };
    }
  }
}

export default new PostPublishingService();
