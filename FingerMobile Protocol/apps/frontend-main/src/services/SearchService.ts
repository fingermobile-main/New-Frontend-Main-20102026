import React, {} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';

export interface SearchResult {
  type: 'user' | 'post' | 'music' | 'video' | 'product' | 'community'; id: string; title: string;
  description?: string;
  image?: string; relevanceScore: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: {
  start: string; end: string;
  };
  sortBy?: 'relevance' | 'date' | 'popularity';
  order?: 'asc' | 'desc';
}

class SearchService {
  private api = axios.create({baseURL: `${API_BASE_URL}/search`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  async search(query: string, filters?: SearchFilters,
    limit: number = 20): Promise<SearchResult[]> {
    const response = await this.api.post('/', { query, filters, limit });
    return response.data;
  }

  async searchUsers(query: string,
    limit: number = 10): Promise<SearchResult[]> {
    const response = await this.api.get('/users', {params: { query,
      limit } });
    return response.data;
  }

  async searchPosts(query: string,
    limit: number = 20): Promise<SearchResult[]> {
    const response = await this.api.get('/posts', {params: { query,
      limit } });
    return response.data;
  }

  async searchMusic(query: string,
    limit: number = 20): Promise<SearchResult[]> {
    const response = await this.api.get('/music', {params: { query,
      limit } });
    return response.data;
  }

  async searchVideos(query: string,
    limit: number = 20): Promise<SearchResult[]> {
    const response = await this.api.get('/videos', {params: { query,
      limit } });
    return response.data;
  }

  async searchProducts(query: string,
    limit: number = 20): Promise<SearchResult[]> {
    const response = await this.api.get('/products', {params: { query,
      limit } });
    return response.data;
  }

  async searchCommunities(query: string,
    limit: number = 10): Promise<SearchResult[]> {
    const response = await this.api.get('/communities', {params: { query,
      limit } });
    return response.data;
  }

  async getSearchSuggestions(query: string,
    limit: number = 5): Promise<string[]> {
    const response = await this.api.get('/suggestions', {params: { query,
      limit } });
    return response.data;
  }

  async getTrendingSearches(limit: number = 10): Promise<string[]> {
    const response = await this.api.get('/trending', {
      params: { limit } });
    return response.data;
  }

  async saveSearchHistory(query: string): Promise<void> {
    await this.api.post('/history', { query });
  }

  async getSearchHistory(limit: number = 10): Promise<string[]> {
    const response = await this.api.get('/history', {
      params: { limit } });
    return response.data;
  }

  async clearSearchHistory(): Promise<void> {
    await this.api.delete('/history');
  }
}

export const searchService = new SearchService();
export default searchService;
