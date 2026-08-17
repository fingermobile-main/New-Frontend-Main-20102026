import React, {} from 'react';
import logger from '../utils/logger';

import axios from 'axios';

export class ApiServiceClass {
  private axiosInstance: any;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );
  }

  async get(url: string, params?: unknown) {
    try {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
    } catch (error) {
      logger.error('get error:', error);
      throw error;
    }
  }

  async post(url: string, data?: unknown) {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async put(url: string, data?: unknown) {
    try {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
    } catch (error) {
      logger.error('put error:', error);
      throw error;
    }
  }

  async delete(url: string) {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }

  async request<T>(url: string, config: any = {}): Promise<T> {
    const { method = 'GET', data, params, ...rest } = config;
    try {
      const response = await this.axiosInstance.request({
        url,
        method,
        data,
        params,
        ...rest
      });
      return response.data as T;
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // ── Streaming Support ──

  /**
   * Server-Sent Events (SSE) streaming
   * Connects to an SSE endpoint and receives real-time updates
   * @param url - The SSE endpoint URL
   * @param onMessage - Callback for each message event
   * @param onOpen - Optional callback when connection opens
   * @param onError - Optional callback for errors
   * @returns EventSource instance (call .close() to disconnect)
   */
  connectSSE(url: string, onMessage: (data: unknown, event?: string) => void, onOpen?: () => void, onError?: (error?: Event) => void): EventSource {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.info(`SSE connected to ${url}`);
      onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data, (event as any).event || undefined);
      } catch (error) {
        console.error('SSE parse error:', error);
        onMessage(event.data, (event as any).event || undefined);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      onError?.(error);
    };

    return eventSource;
  }

  /**
   * Fetch with ReadableStream for large payloads or real-time data
   * @param url - The API endpoint
   * @param onChunk - Callback for each chunk of data
   * @param options - Optional fetch options (method, headers, body, etc.)
   * @returns AbortController (call .abort() to cancel)
   */
  async streamResponse(url: string, onChunk: (chunk: string) => void, options: RequestInit = {}): Promise<AbortController> {
    const controller = new AbortController();
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.axiosInstance.defaults.baseURL}${url}`, {
        ...options,
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error!, status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder();

      const read = async () => {
        try {
        const { done, value } = await reader.read();
        if (done) {
          console.info('Stream complete');
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
        await read();
        } catch (error) {
          logger.error('anonymous error:', error);
          throw error;
        }
      };

      await read();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.info('Stream aborted');
      } else {
        console.error('Stream error:', error);
        throw error;
      }
    }

    return controller;
  }

  /**
   * WebSocket connection for real-time bidirectional communication
   * @param url - The WebSocket endpoint URL
   * @param onMessage - Callback for incoming messages
   * @param onOpen - Optional callback when connection opens
   * @param onClose - Optional callback when connection closes
   * @param onError - Optional callback for errors
   * @returns WebSocket instance
   */
  connectWebSocket(url: string, onMessage: (data: any) => void, onOpen?: () => void, onClose?: () => void, onError?: (error: Event) => void): WebSocket {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.info(`WebSocket connected to ${url}`);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket parse error:', error);
        onMessage(event.data);
      }
    };

    ws.onclose = () => {
      console.info('WebSocket closed');
      onClose?.();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    return ws;
  }

  async getPosts() {
    return this.get('/posts');
  }
  
  // Static method wrapper for convenience
  private static instance?: ApiServiceClass;
  
  static getInstance(): ApiServiceClass {
    if (!ApiServiceClass.instance) {
      ApiServiceClass.instance = new ApiServiceClass();
    }
    return ApiServiceClass.instance;
  }
  
  static async request<T>(url: string, config: any = {}): Promise<T> {
    return ApiServiceClass.getInstance().request<T>(url, config);
  }
  
  static async get<T>(url: string, params?: unknown): Promise<T> {
    return ApiServiceClass.getInstance().get(url, params);
  }
  
  static async post<T>(url: string, data?: unknown): Promise<T> {
    return ApiServiceClass.getInstance().post(url, data);
  }
  
  static async put<T>(url: string, data?: unknown): Promise<T> {
    return ApiServiceClass.getInstance().put(url, data);
  }
  
  static async delete<T>(url: string): Promise<T> {
    return ApiServiceClass.getInstance().delete(url);
  }
  
  static async getGames<T>(): Promise<T> {
    return ApiServiceClass.getInstance().get('/games');
  }
}

const apiService = new ApiServiceClass();
export default apiService;

// Named export alias for pages using the service
export { ApiServiceClass as ApiService };
