import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Forum {id: string; name: string;
  description?: string; category: string;
  topics: number;
  posts: number;
  lastActivity?: string; isLocked: boolean;
}

export interface ForumTopic {id: string; forumId: string;
  title: string;
  authorId: string;
  authorName: string;
  content: string;
  views: number;
  replies: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

class ForumService {
  private api = axios.create({baseURL: `${API_BASE_URL}/forums`,
headers: {
      'Content-Type': 'application/json'
    }
  });

  async getForums(category?: string): Promise<Forum[]> {
    const response = await this.api.get('/', {params: { category } });
    return response.data;
  }

  async getForumById(forumId: string): Promise<Forum> {
    const response = await this.api.get(`/${forumId}`);
    return response.data;
  }

  async createForum(name: string,
    category: string,
    description?: string): Promise<Forum> {
    const response = await this.api.post('/', { name, description, category });
    return response.data;
  }

  async getTopics(forumId: string,
sortBy: string = 'recent',
limit: number = 20): Promise<ForumTopic[]> {
    const response = await this.api.get(`/${forumId}/topics`, {params: { sortBy,
  limit } });
    return response.data;
  }

  async getTopicById(topicId: string): Promise<ForumTopic> {
    const response = await this.api.get(`/topics/${topicId}`);
    return response.data;
  }

  async createTopic(forumId: string,
title: string,
content: string): Promise<ForumTopic> {
    const response = await this.api.post(`/${forumId}/topics`, { title, content });
    return response.data;
  }

  async updateTopic(topicId: string,
updates: Partial<ForumTopic>): Promise<ForumTopic> {
    const response = await this.api.put(`/topics/${topicId}`, updates);
    return response.data;
  }

  async deleteTopic(topicId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}`);
  }

  async pinTopic(topicId: string): Promise<void> {
    await this.api.post(`/topics/${topicId}/pin`);
  }

  async unpinTopic(topicId: string): Promise<void> {
    await this.api.post(`/topics/${topicId}/unpin`);
  }

  async lockTopic(topicId: string): Promise<void> {
    await this.api.post(`/topics/${topicId}/lock`);
  }

  async unlockTopic(topicId: string): Promise<void> {
    await this.api.post(`/topics/${topicId}/unlock`);
  }

  async likeTopic(topicId: string): Promise<void> {
    await this.api.post(`/topics/${topicId}/like`);
  }

  async unlikeTopic(topicId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}/like`);
  }

  async getTopicReplies(topicId: string,
limit: number = 20): Promise<any[]> {
    const response = await this.api.get(`/topics/${topicId}/replies`, {params: { limit } });
    return response.data;
  }

  async addReply(topicId: string,
content: string): Promise<unknown> {
    const response = await this.api.post(`/topics/${topicId}/replies`, { content });
    return response.data;
  }

  async searchTopics(query: string, forumId?: string): Promise<ForumTopic[]> {
    const response = await this.api.get('/topics/search', {params: { query,
  forumId } });
    return response.data;
  }

  async getTrendingTopics(limit: number = 10): Promise<ForumTopic[]> {
    const response = await this.api.get('/topics/trending', {params: { limit } });
    return response.data;
  }
}

export const forumService = new ForumService();
export default forumService;
