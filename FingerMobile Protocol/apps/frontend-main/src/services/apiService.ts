/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
import logger from '../utils/logger';
import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:5001/api`;
};

export class ApiServiceClass {
  private axiosInstance: any;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getBaseUrl(),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // Automatically normalize redundant leading /api if present
        if (config.url && typeof config.url === 'string') {
          if (config.url.startsWith('/api/')) {
            config.url = config.url.substring(4);
          } else if (config.url === '/api') {
            config.url = '/';
          }
        }
        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          localStorage.getItem('fingermobile_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );
  }

  async get<T = any>(url: string, params?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      logger.error('get error:', error);
      throw error;
    }
  }

  async post<T = any>(url: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async patch<T = any>(url: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.patch(url, data);
    return response.data;
  }

  async put<T = any>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      logger.error('put error:', error);
      throw error;
    }
  }

  async delete<T = any>(url: string): Promise<T> {
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
      logger.error(`API request error for ${url}:`, error);
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
  connectSSE(url: string, onMessage: (_data: unknown, _event?: string) => void, onOpen?: () => void, onError?: (_error?: Event) => void): EventSource {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      logger.info(`SSE connected to ${url}`);
      onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data, (event as any).event || undefined);
      } catch (error) {
        logger.error('SSE parse error:', error);
        onMessage(event.data, (event as any).event || undefined);
      }
    };

    eventSource.onerror = (error) => {
      logger.error('SSE error:', error);
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
  async streamResponse(url: string, onChunk: (_chunk: string) => void, options: RequestInit = {}): Promise<AbortController> {
    const controller = new AbortController();
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const cleanUrl = url.startsWith('/api/') ? url.substring(4) : (url === '/api' ? '/' : url);

    try {
      const response = await fetch(`${this.axiosInstance.defaults.baseURL}${cleanUrl}`, {
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
            logger.info('Stream complete');
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
        logger.info('Stream aborted');
      } else {
        logger.error('Stream error:', error);
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
  connectWebSocket(url: string, onMessage: (_data: any) => void, onOpen?: () => void, onClose?: () => void, onError?: (_error: Event) => void): WebSocket {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      logger.info(`WebSocket connected to ${url}`);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        logger.error('WebSocket parse error:', error);
        onMessage(event.data);
      }
    };

    ws.onclose = () => {
      logger.info('WebSocket closed');
      onClose?.();
    };

    ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
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
export { apiService, ApiServiceClass as ApiService };
