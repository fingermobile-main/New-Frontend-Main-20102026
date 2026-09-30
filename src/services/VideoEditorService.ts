import React, {} from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- ENHANCED TYPES & VIDEO SCHEMA ---

export interface VideoEditProject {
  id: string;
  name: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number; // in seconds
  status: 'draft' | 'rendering' | 'completed' | 'failed';
  effects: VideoEffect[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoEffect {
  id: string;
  type: 'trim' | 'text' | 'music' | 'filter' | 'transition';
  startTime: number; // Milliseconds or seconds timestamp
  endTime?: number;
  config: Record<string, any>; // Strictly type configuration variants
}

export interface ExportConfig {
  format: 'mp4' | 'webm' | 'mov';
  resolution: '720p' | '1080p' | '4k'; // Used to enforce subscription/paywall constraints
  fps: 30 | 60;
}

export interface ExportJobStatus {
  jobId: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // Percentage value (0 - 100)
  downloadUrl?: string;
  error?: string;
}

class VideoEditorService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/video-editor`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Implicitly authenticate requests to prevent user account tampering
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api(config);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Video composition pipeline error';
      console.error('[VideoEditorService Error]:', errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  // --- PROJECT MANAGEMENT (Session Secure) ---

  async createProject(name: string, videoUrl: string): Promise<VideoEditProject> {
    return this.request<VideoEditProject>({
      method: 'POST',
      url: '/projects',
      data: { name, videoUrl }
    });
  }

  /**
   * Safe fetching: Returns only the active user's projects based on auth headers.
   */
  async getMyProjects(): Promise<VideoEditProject[]> {
    return this.request<VideoEditProject[]>({ method: 'GET', url: '/projects' });
  }

  async getProjectById(projectId: string): Promise<VideoEditProject> {
    return this.request<VideoEditProject>({ method: 'GET', url: `/projects/${projectId}` });
  }

  async deleteProject(projectId: string): Promise<void> {
    return this.request<void>({ method: 'DELETE', url: `/projects/${projectId}` });
  }

  // --- TIMELINE EFFECTS & STATE MANAGEMENT ---

  async addEffect(projectId: string, effect: Omit<VideoEffect, 'id'>): Promise<VideoEditProject> {
    return this.request<VideoEditProject>({
      method: 'POST',
      url: `/projects/${projectId}/effects`,
      data: effect
    });
  }

  async removeEffect(projectId: string, effectId: string): Promise<VideoEditProject> {
    return this.request<VideoEditProject>({
      method: 'DELETE',
      url: `/projects/${projectId}/effects/${effectId}`
    });
  }

  /**
   * Optimization: Syncs the full state of a video timeline layout in a single batch request.
   * This prevents spamming the network when dragging objects around the screen.
   */
  async saveComposition(projectId: string, effects: VideoEffect[]): Promise<VideoEditProject> {
    return this.request<VideoEditProject>({
      method: 'PUT',
      url: `/projects/${projectId}/composition`,
      data: { effects }
    });
  }

  // --- HEAVY TRANSCODING / BACKGROUND RENDERING ENGINE ---

  /**
   * Dispatches a video encoding pipeline background task.
   * Returns a long-running Job ID instead of an immediate download URL to avoid gateway timeouts.
   */
  async exportVideo(projectId: string, config: ExportConfig): Promise<{ jobId: string }> {
    return this.request<{ jobId: string }>({
      method: 'POST',
      url: `/projects/${projectId}/export`,
      data: config
    });
  }

  /**
   * Polls the live encoding processing progress of a background render job.
   */
  async getExportStatus(jobId: string): Promise<ExportJobStatus> {
    return this.request<ExportJobStatus>({
      method: 'GET',
      url: `/exports/jobs/${jobId}`
    });
  }

  // --- ASSET REPOSITORIES ---

  async getAvailableEffects(): Promise<{
    filters: Array<{ id: string; name: string; thumbnail?: string }>;
    transitions: string[];
    fonts: string[];
  }> {
    return this.request({ method: 'GET', url: '/effects/available' });
  }
}

export const videoEditorService = new VideoEditorService();
export default videoEditorService;
