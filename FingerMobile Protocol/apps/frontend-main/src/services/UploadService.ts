import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface UploadResult {id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

export interface MediaFile {id: string;
  userId: string;
  filename: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  duration?: number;
  uploadedAt: string;
}

class UploadService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/uploads`,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  constructor() {
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('accessToken');
        if (token) {
          if (!config.headers) {
            config.headers = {} as any;
          }
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  async uploadFile(file: File, category?: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);

    const response = await this.api.post('/file', formData);
    return response.data?.data || response.data;
  }

  async uploadMultipleFiles(files: File[], category?: string): Promise<UploadResult[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (category) formData.append('category', category);

    const response = await this.api.post('/multiple', formData);
    return response.data?.data || response.data;
  }

  async uploadImage(file: File, options?: { width?: number; height?: number; quality?: number }): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.width) formData.append('width', options.width.toString());
    if (options?.height) formData.append('height', options.height.toString());
    if (options?.quality) formData.append('quality', options.quality.toString());

    const response = await this.api.post('/image', formData);
    return response.data;
  }

  async uploadVideo(file: File, options?: { compress?: boolean; thumbnail?: boolean }): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('video', file);
    if (options?.compress) formData.append('compress', 'true');
    if (options?.thumbnail) formData.append('thumbnail', 'true');

    const response = await this.api.post('/video', formData);
    return response.data;
  }

  async uploadAudio(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await this.api.post('/audio', formData);
    return response.data;
  }

  async getMediaLibrary(userId: string, type?: string,
    limit: number = 20): Promise<MediaFile[]> {
    const response = await this.api.get(`/library/${userId}`, { params: { type,
      limit } });
    return response.data;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.api.delete(`/${fileId}`);
  }

  async getFileUrl(fileId: string): Promise<string> {
    const response = await this.api.get(`/${fileId}/url`);
    return response.data.url;
  }

  async getUploadProgress(uploadId: string): Promise<{progress: number;
  status: string }> {
    const response = await this.api.get(`/progress/${uploadId}`);
    return response.data;
  }
}

export const uploadService = new UploadService();
export default uploadService;
