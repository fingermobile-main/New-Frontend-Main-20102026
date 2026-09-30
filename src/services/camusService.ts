import React, {} from 'react';
/**
 * Camus Service - AI Assistant Integration
 * Handles communication with the Camus AI backend
 */

import { api } from './api';

export interface CamusMessage {id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string,
  unknown>;
}

export interface CamusConversation {id: string;
  messages: CamusMessage[];
  created_at: string;
  updated_at: string;
}

export interface CamusResponse {success: boolean;
  conversation_id?: string;
  message?: CamusMessage;
  error?: string;
}

class CamusService {
  private baseUrl = '/api/camus';

  async startConversation(): Promise<CamusConversation> {
    const response = await api.post(`${this.baseUrl}/conversations`);
    return response.data;
  }

  async sendMessage(conversationId: string,
    message: string): Promise<CamusResponse> {
    const response = await api.post(`${this.baseUrl}/conversations/${conversationId}/messages`, {content: message
    });
    return response.data;
  }

  async getConversation(conversationId: string): Promise<CamusConversation> {
    const response = await api.get(`${this.baseUrl}/conversations/${conversationId}`);
    return response.data;
  }

  async listConversations(page = 1, limit = 20): Promise<{conversations: CamusConversation[],
  total: number }> {
    const response = await api.get(`${this.baseUrl}/conversations`, {params: { page,
      limit }
    });
    return response.data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/conversations/${conversationId}`);
  }

  async clearHistory(conversationId: string): Promise<void> {
    await api.post(`${this.baseUrl}/conversations/${conversationId}/clear`);
  }

  async getStatus(): Promise<{status: string;
  version: string;
  capabilities: string[] }> {
    const response = await api.get(`${this.baseUrl}/status`);
    return response.data;
  }
}

export const camusService = new CamusService();
