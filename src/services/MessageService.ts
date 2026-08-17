import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Message {id: string; conversationId: string; senderId: string;
  receiverId: string; content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  mediaUrl?: string;
  read: boolean; createdAt: string;
}

export interface Conversation {id: string; participants: string[];
  lastMessage?: Message;
  unreadCount: number; updatedAt: string;
}

class MessageService {
  private api = axios.create({baseURL: `${API_BASE_URL}/discover`, headers: { 'Content-Type': 'application/json'
    }
  });

  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await this.api.get(`/conversations/${userId}`);
    return response.data;
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await this.api.get(`/conversations/${conversationId}`);
    return response.data;
  }

  async createConversation(participantIds: string[]): Promise<Conversation> {
    const response = await this.api.post('/conversations', { participantIds });
    return response.data;
  }

  async getMessages(conversationId: string, limit: number = 50,
offset: number = 0): Promise<Message[]> {
    const response = await this.api.get(`/conversations/${conversationId}/messages`, {params: { limit,
  offset } });
    return response.data;
  }

  async sendMessage(conversationId: string, content: string, type: string = "text", mediaUrl?: string): Promise<Message> {
    const response = await this.api.post(`/conversations/${conversationId}/messages`, {
      content,
      type,
      mediaUrl
    });
    return response.data;
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.api.put(`/messages/${messageId}/read`);
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await this.api.put(`/conversations/${conversationId}/read`);
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.api.delete(`/messages/${messageId}`);
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    const response = await this.api.put(`/messages/${messageId}`, { content });
    return response.data;
  }

  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    const response = await this.api.get('/search', {params: { query,
  conversationId } });
    return response.data;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const response = await this.api.get(`/unread/${userId}`);
    return response.data.count;
  }
}

export const messageService = new MessageService();
export default messageService;
