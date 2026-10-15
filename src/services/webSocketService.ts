import React, {} from 'react';
/**
 * ⚡ FINGERMOBILE PROTOCOL - REAL-TIME GATEWAY ENGINE
 * PURPOSE: Abstract WebSocket Core Layer handling connection persistence, backoff reconnects, and message serialization.
 */

import { WebSocketMessage, ConnectionStatus } from '../types/realTime';

export interface WebSocketConfig {
  prodEndpoint: string;
  devEndpoint: string;
  maxReconnectAttempts: number;
  baseReconnectDelay: number;
  heartbeatInterval: number;
  pongTimeout: number;
}

export const DEFAULT_WS_CONFIG: WebSocketConfig = {
  prodEndpoint: 'wss://api.fingermobileprotocol.com/ws',
  devEndpoint: 'ws://localhost:3001/ws',
  maxReconnectAttempts: 5,
  baseReconnectDelay: 1000,
  heartbeatInterval: 30000,
  pongTimeout: 5000
};

export type WebSocketEventCallback = (data: any) => void;

export abstract class WebSocketService {
  // Public lifecycle hooks
  public onConnect: (() => void) | null = null;
  public onDisconnect: (() => void) | null = null;
  public onError: ((error: Event) => void) | null = null;

  protected socket: WebSocket | null = null;
  protected messageCallbacks = new Map<string, WebSocketEventCallback[]>();
  protected connectionStatus: ConnectionStatus = 'disconnected';
  protected reconnectAttempts = 0;
  protected config: WebSocketConfig;
  protected endpoint: string;

  protected heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  protected pongTimeout: ReturnType<typeof setTimeout> | null = null;
  protected memberId: string | null = null;
  protected token: string | null = null;

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = { ...DEFAULT_WS_CONFIG, ...config };
    this.endpoint =
      process.env.NODE_ENV === 'production'
        ? this.config.prodEndpoint
        : this.config.devEndpoint;
  }

  public connect(memberId?: string, token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 1. SSR Protection layer: Block execution if compiled on server context
      if (typeof window === 'undefined') {
        reject(new Error('Cannot initialize raw WebSocket protocols during SSR pipeline execution.'));
        return;
      }

      if (this.connectionStatus === 'connected' && this.socket) {
        resolve();
        return;
      }

      if (memberId) this.memberId = memberId;
      if (token) this.token = token;

      this.connectionStatus = 'connecting';

      try {
        const queryParams = new URLSearchParams();
        if (this.memberId) queryParams.append('memberId', this.memberId);
        if (this.token) queryParams.append('token', this.token);

        const wsUrl = `${this.endpoint}?${queryParams.toString()}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.info(`[${this.constructor.name}] Real-time interface link established.`);
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
          if (this.onConnect) this.onConnect();
        };

        this.socket.onmessage = (event: MessageEvent) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data as string);

            // Immediate short-circuit on platform baseline heartbeat pongs
            if (message.event === 'pong') {
              if (this.pongTimeout) {
                clearTimeout(this.pongTimeout);
                this.pongTimeout = null;
              }
              return;
            }

            this.handleIncomingMessage(message);
          } catch (error) {
            console.error(`[${this.constructor.name}] Parsing processing exception:`, error);
          }
        };

        this.socket.onerror = (error: Event) => {
          console.error(`[${this.constructor.name}] Under-the-hood protocol runtime exception:`, error);
          this.cleanup();
          reject(error);
          if (this.onError) this.onError(error);
        };

        this.socket.onclose = (event: CloseEvent) => {
          console.info(`[${this.constructor.name}] Client interface link uncoupled:`, event.reason);
          this.cleanup();

          // Do not reconnect on expected graceful terminations (Client intentional closure)
          if (event.code !== 1000 && this.memberId && this.token) {
            this.attemptReconnect();
          }
          if (this.onDisconnect) this.onDisconnect();
        };
      } catch (error) {
        this.connectionStatus = 'disconnected';
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      // 1000 represents a normal, intentional connection termination
      this.socket.close(1000, 'Graceful programmatic uncoupling');
    }
    this.cleanup();
    if (this.onDisconnect) this.onDisconnect();
  }

  protected cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      this.socket = null;
    }

    this.connectionStatus = 'disconnected';
  }

  protected startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.sendMessage('ping', {});

        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
        }

        this.pongTimeout = setTimeout(() => {
          console.warn(`[${this.constructor.name}] Heartbeat timeout reached without server ack. Dropping stale interface.`);
          if (this.socket) {
            this.socket.close();
          }
        }, this.config.pongTimeout);
      }
    }, this.config.heartbeatInterval);
  }

  public sendMessage(event: string, data: unknown): void {
    if (this.connectionStatus !== 'connected' || !this.socket) {
      console.warn(`[${this.constructor.name}] Dropping outbound buffer transmission: Active socket link missing.`);
      return;
    }

    // Safely cast or structure outbound wrapped standard messages without needing @ts-ignore
    const message: WebSocketMessage =
      data && typeof data === 'object' && 'event' in data && 'data' in data
        ? (data as unknown as WebSocketMessage)
        : {
          event,
          data,
          timestamp: Date.now()
        };

    try {
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error(`[${this.constructor.name}] Outbound formatting socket transmission exception:`, error);
    }
  }

  public subscribe(event: string, callback: WebSocketEventCallback): void {
    if (!this.messageCallbacks.has(event)) {
      this.messageCallbacks.set(event, []);
    }
    this.messageCallbacks.get(event)?.push(callback);
  }

  public unsubscribe(event: string, callback: WebSocketEventCallback): void {
    const callbacks = this.messageCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  protected handleIncomingMessage(message: WebSocketMessage): void {
    const { event, data } = message;
    const callbacks = this.messageCallbacks.get(event);

    if (callbacks && callbacks.length > 0) {
      callbacks.forEach((callback) => {
        try {
          let processedData = data;

          // Deserialize nested specialized platform structures (Maps & Sets)
          if (data && typeof data === 'object') {
            const dataObj = data as Record<string, any>;
            if ('dataType' in dataObj && 'value' in dataObj) {
              if (dataObj.dataType === 'Map') {
                processedData = new Map(dataObj.value);
              } else if (dataObj.dataType === 'Set') {
                processedData = new Set(dataObj.value);
              }
            }
          }

          callback(processedData);
        } catch (error) {
          console.error(`[${this.constructor.name}] Exception thrown inside handler executing for event "${event}":`, error);
        }
      });
    }
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  protected attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error(`[${this.constructor.name}] Reconnection baseline limit breached. Killing loop context.`);
      return;
    }

    this.reconnectAttempts++;

    // Exponential binary backoff capped cleanly at a maximum threshold of 30 seconds
    const delay = Math.min(
      Math.pow(2, this.reconnectAttempts) * this.config.baseReconnectDelay,
      30000
    );

    console.warn(`[${this.constructor.name}] Reconnect scheduled -> Attempt #${this.reconnectAttempts} stalling for ${delay}ms`);

    setTimeout(() => {
      if (this.memberId && this.token) {
        this.connect(this.memberId, this.token).catch(() => {
          // Failure continues cascading down the backoff queue loop
          this.attemptReconnect();
        });
      }
    }, delay);
  }
}
