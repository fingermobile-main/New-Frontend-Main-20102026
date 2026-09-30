import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface MusicTrack {id: string; title: string;
  artist: string;
  album?: string;
  duration: number;
  genre?: string;
  coverArt?: string;
  audioUrl: string;
  lyrics?: string;
  uploadDate: string; plays: number;
  likes: number;
}

export interface Playlist {id: string; name: string;
  description?: string;
  userId: string; tracks: MusicTrack[];
  isPublic: boolean; createdAt: string;
  updatedAt: string;
}

export interface MusicUploadData {file: File; title: string;
  artist: string;
  album?: string;
  genre?: string;
  description?: string;
}

class MusicService {
  private api = axios.create({baseURL: `${API_BASE_URL}/discover`, headers: { 'Content-Type': 'application/json'
  }
  });

  async uploadTrack(uploadData: MusicUploadData): Promise<MusicTrack> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('artist', uploadData.artist);
    if (uploadData.album) formData.append('album', uploadData.album);
    if (uploadData.genre) formData.append('genre', uploadData.genre);
    if (uploadData.description) formData.append('description', uploadData.description);

    const response = await this.api.post('/upload', formData, {headers: { 'Content-Type': 'multipart/form-data'
    }
    });
    return response.data;
  }

  async getTracks(genre?: string,
    limit: number = 20): Promise<MusicTrack[]> {
    const response = await this.api.get('/tracks', {params: { genre,
      limit } });
    return response.data;
  }

  async getTrackById(trackId: string): Promise<MusicTrack> {
    const response = await this.api.get(`/tracks/${trackId}`);
    return response.data;
  }

  async searchTracks(query: string): Promise<MusicTrack[]> {
    const response = await this.api.get('/tracks/search', {params: { query } });
    return response.data;
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    const response = await this.api.get(`/playlists/user/${userId}`);
    return response.data;
  }

  async createPlaylist(name: string, description?: string,
    isPublic: boolean = true): Promise<Playlist> {
    const response = await this.api.post('/playlists', { name, description, isPublic });
    return response.data;
  }

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<Playlist> {
    const response = await this.api.post(`/playlists/${playlistId}/tracks`, { trackId });
    return response.data;
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<Playlist> {
    const response = await this.api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
    return response.data;
  }

  async updateLyrics(trackId: string, lyrics: string): Promise<MusicTrack> {
    const response = await this.api.put(`/tracks/${trackId}/lyrics`, { lyrics });
    return response.data;
  }

  async likeTrack(trackId: string): Promise<void> {
    await this.api.post(`/tracks/${trackId}/like`);
  }

  async unlikeTrack(trackId: string): Promise<void> {
    await this.api.delete(`/tracks/${trackId}/like`);
  }

  async getTrendingTracks(limit: number = 10): Promise<MusicTrack[]> {
    const response = await this.api.get('/tracks/trending', {params: { limit } });
    return response.data;
  }
}

export const musicService = new MusicService();
export default musicService;
