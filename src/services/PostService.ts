import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Post {id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  media?: string[];
  type: "text" | "image" | "video" | "audio" | "link";
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {content: string;
  media?: File[];
  type?: "text" | "image" | "video" | "audio" | "link";
  tags?: string[];
  location?: string;
}

class PostService {
  private api = axios.create({baseURL: `${API_BASE_URL}/posts`,
headers: {
      'Content-Type': 'application/json'
    }
  });

  async getPosts(limit: number = 20,
offset: number = 0): Promise<Post[]> {
    const response = await this.api.get('/', {params: { limit,
  offset } });
    return response.data;
  }

  async getUserPosts(userId: string,
limit: number = 20): Promise<Post[]> {
    const response = await this.api.get(`/user/${userId}`, {params: { limit } });
    return response.data;
  }

  async getPostById(postId: string): Promise<Post> {
    const response = await this.api.get(`/${postId}`);
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.type) formData.append('type', data.type);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.location) formData.append('location', data.location);
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', file);
      });
    }

    const response = await this.api.post('/', formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updatePost(postId: string,
content: string): Promise<Post> {
    const response = await this.api.put(`/${postId}`, { content });
    return response.data;
  }

  async deletePost(postId: string): Promise<void> {
    await this.api.delete(`/${postId}`);
  }

  async likePost(postId: string): Promise<void> {
    await this.api.post(`/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<void> {
    await this.api.delete(`/${postId}/like`);
  }

  async sharePost(postId: string): Promise<void> {
    await this.api.post(`/${postId}/share`);
  }

  async bookmarkPost(postId: string): Promise<void> {
    await this.api.post(`/${postId}/bookmark`);
  }

  async unbookmarkPost(postId: string): Promise<void> {
    await this.api.delete(`/${postId}/bookmark`);
  }

  async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    const response = await this.api.get('/trending', {params: { limit } });
    return response.data;
  }

  async searchPosts(query: string,
limit: number = 20): Promise<Post[]> {
    const response = await this.api.get('/search', {params: { query,
  limit } });
    return response.data;
  }
}

export const postService = new PostService();
export default postService;
