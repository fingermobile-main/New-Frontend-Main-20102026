import React, { useRef, useEffect } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { ProtocolService } from '../services/protocolService';

/**
 * Hook to handle protocol connection status notifications
 * Monitors protocol connection/disconnection events and displays appropriate notifications
 */
export const useProtocolNotifications = () => {
  const { showToast } = useAppContext();
  const handleConnect = useRef<VoidFunction | null>(null);
  const handleDisconnect = useRef<VoidFunction | null>(null);
  const handleError = useRef<((error: Event) => void) | null>(null);

  useEffect(() => {
    // Create stable event handlers
    const handleConnectCallback = () => {
      console.info("Protocol connected");
      showToast && showToast("Connected to protocol", "success");
    };

    const handleDisconnectCallback = () => {
      console.info("Protocol disconnected");
      showToast && showToast("Disconnected from protocol", "info");
    };

    const handleErrorCallback = (error: Event) => {
      console.error("Protocol error:", error);
      showToast && showToast(`Protocol error: ${error.type}`, "error");
    };

    // Store handlers in refs for cleanup
    handleConnect.current = handleConnectCallback;
    handleDisconnect.current = handleDisconnectCallback;
    handleError.current = handleErrorCallback;

    // Assign event handlers directly to the protocol service
    ProtocolService.getInstance().onConnect = handleConnectCallback;
    ProtocolService.getInstance().onDisconnect = handleDisconnectCallback;
    ProtocolService.getInstance().onError = handleErrorCallback;

    // Clean up event handlers
    return () => {
      ProtocolService.getInstance().onConnect = null;
      ProtocolService.getInstance().onDisconnect = null;
      ProtocolService.getInstance().onError = null;
    };
  }, [showToast]);
};
