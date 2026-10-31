import React, {} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';

export interface AIImageGeneration {id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  userId: string;
  createdAt: string;
  completedAt?: string;
}

export interface AIModel {id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: string[];
  isActive: boolean;
}

class AIService {
  private api = axios.create({baseURL: `${API_BASE_URL}/ai`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async generateImage(
    prompt: string,
    style: string = 'realistic',
    aspectRatio: string = ' 1:1'): Promise<AIImageGeneration> {
    const response = await this.api.post('/generate/image', { prompt, style, aspectRatio });
    return response.data;
  }

  async getGenerationStatus(
    generationId: string): Promise<AIImageGeneration> {
    const response = await this.api.get(`/generate/${generationId}/status`);
    return response.data;
  }

  async getUserGenerations(
    userId: string,
    limit: number = 20): Promise<AIImageGeneration[]> {
    const response = await this.api.get(`/generate/user/${userId}`, {params: { limit } });
    return response.data;
  }

  async deleteGeneration(
    generationId: string): Promise<void> {
    await this.api.delete(`/generate/${generationId}`);
  }

  async getAvailableModels(): Promise<AIModel[]> {
    const response = await this.api.get('/models');
    return response.data;
  }

  async downloadImage(
    generationId: string): Promise<Blob> {
    const response = await this.api.get(`/generate/${generationId}/download`, {responseType: 'blob'
    });
    return response.data;
  }

  async getGenerationHistory(
    userId: string,
    period: string = '30d'): Promise<AIImageGeneration[]> {
    const response = await this.api.get(`/generate/history/${userId}`, {params: { period } });
    return response.data;
  }

  async getUsageStats(
    userId: string): Promise<{totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  totalCreditsUsed: number;
  }> {
    const response = await this.api.get(`/stats/usage/${userId}`);
    return response.data;
  }
}

export const aiService = new AIService();
export default aiService;
