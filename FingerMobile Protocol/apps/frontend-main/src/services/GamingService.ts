import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface Game {id: string; title: string;
  description?: string;
  category: string;
  thumbnail?: string;
  rating: number;
  players: number;
  price?: number;
  createdAt: string;
}

export interface GameScore {id: string; gameId: string;
  userId: string;
  username: string;
  score: number;
  rank: number;
  timestamp: string;
}

export interface FingerWarResult {tapsPerSecond: number; totalTaps: number;
  duration: number;
  accuracy: number;
}

class GamingService {
  private api = axios.create({baseURL: API_BASE_URL, headers: {
    'Content-Type': 'application/json'
  }
  });

  async getGames(category?: string): Promise<Game[]> {
    const response = await this.api.get('/games', {params: { category } });
    return response.data;
  }

  async getGameById(gameId: string): Promise<Game> {
    const response = await this.api.get(`/games/${gameId}`);
    return response.data;
  }

  async submitScore(gameId: string, score: number): Promise<GameScore> {
    const response = await this.api.post(`/games/${gameId}/scores`, { score });
    return response.data;
  }

  async getLeaderboard(gameId: string, limit: number = 10): Promise<GameScore[]> {
    const response = await this.api.get(`/games/${gameId}/leaderboard`, {params: { limit } });
    return response.data;
  }

  async submitFingerWarResult(result: FingerWarResult): Promise<unknown> {
    const response = await this.api.post('/fingerwar/submit', result);
    return response.data;
  }

  async getFingerWarHistory(userId: string): Promise<FingerWarResult[]> {
    const response = await this.api.get(`/fingerwar/history/${userId}`);
    return response.data;
  }

  async searchGames(query: string): Promise<Game[]> {
    const response = await this.api.get('/games/search', {params: { query } });
    return response.data;
  }

  async getFeaturedGames(): Promise<Game[]> {
    const response = await this.api.get('/games/featured');
    return response.data;
  }
}

export const gamingService = new GamingService();
export default gamingService;
