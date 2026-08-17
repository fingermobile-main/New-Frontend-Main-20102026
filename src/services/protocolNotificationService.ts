import React, { useRef, useEffect } from 'react';
// protocolNotificationService.ts
// Production-grade singleton state dispatch matrix with protected callback execution blocks.

import { useAppContext } from "../contexts/AppContext";
import protocolService from './protocolService';

export type ProtocolStatus = 'connected' | 'disconnected' | 'error' | 'warning' | 'info';
export type NotificationCallback = (status: ProtocolStatus, message: string) => void;

/**
 * Protocol Notification Service
 * Manages publisher-subscriber registration pipelines for low-level socket connections.
 */
class ProtocolNotificationService {
  private static instance: ProtocolNotificationService;
  private registeredCallbacks: Set<NotificationCallback> = new Set();
  
  private constructor() {}

  public static getInstance(): ProtocolNotificationService {
    if (!ProtocolNotificationService.instance) {
      ProtocolNotificationService.instance = new ProtocolNotificationService();
    }
    return ProtocolNotificationService.instance;
  }

  /**
   * Register a callback to be notified of protocol status changes
   */
  public registerCallback(callback: NotificationCallback): void {
    this.registeredCallbacks.add(callback);
  }

  /**
   * Unregister a callback safely
   */
  public unregisterCallback(callback: NotificationCallback): void {
    this.registeredCallbacks.delete(callback);
  }

  /**
   * Notify all registered subscribers within a safe error isolation block
   */
  public notifyStatusChange(status: ProtocolStatus, message: string): void {
    this.registeredCallbacks.forEach((callback) => {
      try {
        callback(status, message);
      } catch (error) {
        console.error('Error executing protocol notification callback loop:', error);
      }
    });
  }

  public notifyConnected(): void {
    this.notifyStatusChange('connected', 'Protocol connected successfully!');
  }

  public notifyDisconnected(code?: number, reason?: string): void {
    const reasonText = reason ? `: ${reason}` : '';
    this.notifyStatusChange('disconnected', `Protocol disconnected (code: ${code || 'unknown'})${reasonText}`);
  }

  public notifyError(error: any): void {
    const errorMessage = error?.message || 'An unknown structural exception occurred.';
    this.notifyStatusChange('error', `Protocol error: ${errorMessage}`);
  }
}

// Export structural singleton instance
export const protocolNotificationService = ProtocolNotificationService.getInstance();

/**
 * React hook to hook into protocol events inside components without triggering re-renders.
 */
export const useProtocolNotifications = () => {
  const { showToast } = useAppContext();
  
  // Use a stable ref for the toast handler to prevent redundant subscription teardowns
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    const handleProtocolNotification: NotificationCallback = (status, message) => {
      let toastType: 'success' | 'error' | 'info' | 'warning' = 'info';
      
      if (status === 'connected') {
        toastType = 'success';
      } else if (status === 'disconnected' || status === 'error') {
        toastType = 'error';
      }

      showToastRef.current?.(message, toastType);
    };

    protocolNotificationService.registerCallback(handleProtocolNotification);

    return () => {
      protocolNotificationService.unregisterCallback(handleProtocolNotification);
    };
  }, []); // Intentional empty dependency array ensures single activation footprint

  return protocolNotificationService;
};

/**
 * Integration initializer to hook into the fundamental transaction layers of protocolService.
 * Call this exactly once during the initialization block of your root application context.
 */
export const setupProtocolNotifications = (): void => {
  const serviceContext = protocolService as any;

  // Verify core orchestration methods exist before attempting to proxy execution paths
  if (!serviceContext.connectToProtocol || !serviceContext.disconnectProtocol) {
    console.error('Core service manipulation targets are unavailable for setup.');
    return;
  }

  const originalConnectToProtocol = serviceContext.connectToProtocol.bind(serviceContext);
  const originalDisconnectProtocol = serviceContext.disconnectProtocol.bind(serviceContext);
  
  // Override connecting sequence to safely dispatch operational success hooks
  serviceContext.connectToProtocol = async function (...args: any[]) {
    try {
      const result = await originalConnectToProtocol(...args);
      if (result) {
        protocolNotificationService.notifyConnected();
      }
      return result;
    } catch (error) {
      protocolNotificationService.notifyError(error);
      throw error;
    }
  };

  // Override disconnecting behaviors
  serviceContext.disconnectProtocol = function (...args: any[]) {
    protocolNotificationService.notifyDisconnected(1000, 'Normal manual layout disconnection request issued.');
    return originalDisconnectProtocol(...args);
  };

  /**
   * Safely registers websocket proxies, even if socket handles are created lazily down the line.
   */
  const bindLowLevelSocketEventProxies = () => {
    if (!serviceContext.socket) return;

    const originalOnClose = serviceContext.socket.onclose;
    serviceContext.socket.onclose = function (event: CloseEvent) {
      protocolNotificationService.notifyDisconnected(event.code, event.reason);
      if (originalOnClose) originalOnClose.call(this, event);
    };
    
    const originalOnError = serviceContext.socket.onerror;
    serviceContext.socket.onerror = function (error: Event) {
      protocolNotificationService.notifyError(error);
      if (originalOnError) originalOnError.call(this, error);
    };
  };

  // Run dynamic verification mapping checks
  if (serviceContext.socket) {
    bindLowLevelSocketEventProxies();
  } else {
    // Fallback: intercept socket setter if created dynamically post-boot
    let internalSocketReference = serviceContext.socket;
    Object.defineProperty(serviceContext, 'socket', {
      get() {
        return internalSocketReference;
      },
      set(newSocket) {
        internalSocketReference = newSocket;
        if (newSocket) {
          bindLowLevelSocketEventProxies();
        }
      },
      configurable: true,
      enumerable: true
    });
  }
};