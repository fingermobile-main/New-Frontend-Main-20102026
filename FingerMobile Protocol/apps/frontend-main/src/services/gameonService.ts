import React, {} from 'react';
/**
 * GameOn Service - Gaming Platform Integration
 * Handles games, tournaments, leaderboards, and player profiles
 */

import { api } from './api';

export interface Game {id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail: string;
  players_count: number;
  rating: number;
  status: 'active' | 'maintenance' | 'offline';
  created_at: string;
}

export interface Tournament {id: string;
  game_id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  prize_pool: number;
  participants_count: number;
  max_participants: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface PlayerProfile {member_id: string;
  username: string;
  level: number;
  xp: number;
  total_games: number;
  wins: number;
  losses: number;
  win_rate: number;
  rank?: number;
  badges: string[];
}

export interface LeaderboardEntry {rank: number;
  player_id: string;
  username: string;
  score: number;
  avatar?: string;
}

class GameOnService {
  private baseUrl = '/api/gameon';

  async getGames(category?: string): Promise<Game[]> {
    const response = await api.get(`${this.baseUrl}/games`, {params: { category }
    });
    return response.data;
  }

  async getGame(gameId: string): Promise<Game> {
    const response = await api.get(`${this.baseUrl}/games/${gameId}`);
    return response.data;
  }

  async getTournaments(status?: string): Promise<Tournament[]> {
    const response = await api.get(`${this.baseUrl}/tournaments`, {params: { status }
    });
    return response.data;
  }

  async joinTournament(tournamentId: string): Promise<void> {
    await api.post(`${this.baseUrl}/tournaments/${tournamentId}/join`);
  }

  async getPlayerProfile(memberId: string): Promise<PlayerProfile> {
    const response = await api.get(`${this.baseUrl}/players/${memberId}`);
    return response.data;
  }

  async getLeaderboard(gameId: string, period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all'): Promise<LeaderboardEntry[]> {
    const response = await api.get(`${this.baseUrl}/leaderboards/${gameId}`, {params: { period }
    });
    return response.data;
  }

  async submitScore(gameId: string, score: number): Promise<void> {
    await api.post(`${this.baseUrl}/games/${gameId}/scores`, { score });
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get(`${this.baseUrl}/categories`);
    return response.data;
  }
}

export const gameOnService = new GameOnService();
