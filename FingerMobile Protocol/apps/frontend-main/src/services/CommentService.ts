import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface Comment {id: string; postId: string;
  userId: string; username: string;
  userAvatar?: string;
  content: string;
  parentId?: string;
  likes: number; replies: number;
  createdAt: string; updatedAt: string;
}

export interface CreateCommentData {postId: string; content: string;
  parentId?: string;
}

class CommentService {
  private api = axios.create({baseURL: `${API_BASE_URL}/discover`, headers: {
    'Content-Type': 'application/json'
  }
  });

  async getComments(postId: string, parentId?: string,
    limit: number = 20): Promise<Comment[]> {
    const response = await this.api.get(`/post/${postId}`, {params: { parentId,
      limit } });
    return response.data;
  }

  async getCommentById(commentId: string): Promise<Comment> {
    const response = await this.api.get(`/${commentId}`);
    return response.data;
  }

  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await this.api.post('/', data);
    return response.data;
  }

  async updateComment(commentId: string,
    content: string): Promise<Comment> {
    const response = await this.api.put(`/${commentId}`, { content });
    return response.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.api.delete(`/${commentId}`);
  }

  async likeComment(commentId: string): Promise<void> {
    await this.api.post(`/${commentId}/like`);
  }

  async unlikeComment(commentId: string): Promise<void> {
    await this.api.delete(`/${commentId}/like`);
  }

  async getReplies(commentId: string,
    limit: number = 10): Promise<Comment[]> {
    const response = await this.api.get(`/${commentId}/replies`, {params: { limit } });
    return response.data;
  }

  async getUserComments(userId: string,
    limit: number = 20): Promise<Comment[]> {
    const response = await this.api.get(`/user/${userId}`, {params: { limit } });
    return response.data;
  }

  async getRecentComments(limit: number = 10): Promise<Comment[]> {
    const response = await this.api.get('/recent', {params: { limit } });
    return response.data;
  }
}

export const commentService = new CommentService();
export default commentService;
