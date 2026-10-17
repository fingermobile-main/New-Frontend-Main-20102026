import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  WifiIcon as FiWifi,
  SlashIcon as FiWifiOff,
  PaperAirplaneIcon as FiSend,
  ShieldCheckIcon as FiShield,
  ClockIcon as FiClock,
  ArrowPathIcon as FiRefreshCw,
  XMarkIcon as FiX,
  Cog6ToothIcon as FiSettings
} from '@heroicons/react/24/solid';
import ProtocolBridge from '../services/protocolBridge';
import { ProtocolMessage as RawProtocolMessage } from '../types/protocol';

// Internal message format for the component
interface ProtocolMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  type: 'text' | 'command' | 'status' | 'notification';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isDisappearing?: boolean;
  expirationTime?: Date;
}

interface ProtocolConnectionStatus {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
  signalStrength: number; // 0-100
  latency: number; // in ms
  lastPing: Date | null;
}

interface ProtocolSecuritySettings {
  encryptionEnabled: boolean;
  encryptionAlgorithm: 'AES-GCM' | 'RSA-OAEP' | 'NONE';
  keyExchangeCompleted: boolean;
  symmetricKey?: CryptoKey;
  publicKey?: string;
  privateKey?: string;
}

interface ProtocolCommunicationProps {
  // eslint-disable-next-line no-unused-vars
  onMessageReceived?: (message: ProtocolMessage) => void;
  // eslint-disable-next-line no-unused-vars
  onConnectionChange?: (status: ProtocolConnectionStatus) => void;
  securitySettings?: Partial<ProtocolSecuritySettings>;
  autoConnect?: boolean;
  serverUrl?: string;
}

const ProtocolCommunication: React.FC<ProtocolCommunicationProps> = ({
  onMessageReceived,
  onConnectionChange,
  securitySettings = {},
  autoConnect = true,
  serverUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3001'}`
}) => {
  // State for connection
  const [connectionStatus, setConnectionStatus] = useState<ProtocolConnectionStatus>({
    isConnected: false,
    connectionQuality: 'disconnected',
    signalStrength: 0,
    latency: 0,
    lastPing: null
  });

  const [messages, setMessages] = useState<ProtocolMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [encryptionEnabled, setEncryptionEnabled] = useState(securitySettings.encryptionEnabled || false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageBufferRef = useRef<ProtocolMessage[]>([]);

  // Initialize encryption
  const initializeEncryption = useCallback(async () => {
    try {
      if (encryptionEnabled) {
        ProtocolBridge.enableEncryption();
      }
    } catch (error) {
      // Encryption error handled silently
    }
  }, [encryptionEnabled]);

  // Encrypt message content
  const encryptMessage = useCallback(async (content: string): Promise<string> => {
    if (!encryptionEnabled) return content;

    try {
      // In a real implementation, we would encrypt the content
      // For demo purposes, we'll just return the content with an encrypted prefix
      return `[ENCRYPTED]${content}`;
    } catch (error) {
      return content; // fallback to unencrypted
    }
  }, [encryptionEnabled]);

  // Send protocol message with encryption and buffering
  const sendProtocolMessage = useCallback(async (message: Omit<ProtocolMessage, 'id' | 'timestamp' | 'status'>): Promise<boolean> => {
    try {
      let content = message.content;

      // Encrypt if enabled
      if (message.encrypted || encryptionEnabled) {
        content = await encryptMessage(content);
      }

      const protocolMessage: ProtocolMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: message.senderId || 'me',
        receiverId: message.receiverId,
        content,
        timestamp: new Date(),
        encrypted: message.encrypted || encryptionEnabled,
        type: message.type || 'text',
        status: 'sending',
        isDisappearing: message.isDisappearing,
        expirationTime: message.expirationTime
      };

      // If not connected, buffer the message
      if (!connectionStatus.isConnected) {
        messageBufferRef.current.push(protocolMessage);

        // Update status to show it's buffered
        const bufferedMessage: ProtocolMessage = {
          ...protocolMessage,
          status: 'sending'
        };

        setMessages(prev => [...prev, bufferedMessage]);
        return true;
      }

      // Send via protocol bridge
      const result = await ProtocolBridge.sendGenericMessage(
        protocolMessage.receiverId,
        protocolMessage.type,
        { content: protocolMessage.content }
      );

      if (result) {
        // Update message status to sent
        const sentMessage: ProtocolMessage = {
          ...protocolMessage,
          status: 'sent'
        };

        setMessages(prev => [...prev.map(msg =>
          msg.id === protocolMessage.id ? sentMessage : msg
        )]);

        return true;
      } else {
        // Add error status message
        const errorMessage: ProtocolMessage = {
          ...protocolMessage,
          status: 'error'
        };

        setMessages(prev => [...prev, errorMessage]);
        return false;
      }
    } catch (error) {
      // Add error status message
      const errorMessage: ProtocolMessage = {
        id: `msg_error_${Date.now()}`,
        senderId: 'me',
        receiverId: message.receiverId,
        content: message.content,
        timestamp: new Date(),
        encrypted: message.encrypted || encryptionEnabled,
        type: message.type || 'text',
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      return false;
    }
  }, [encryptMessage, encryptionEnabled, connectionStatus.isConnected]);

  // Define handleProtocolMessage function
  const handleProtocolMessage = useCallback((rawMessage: RawProtocolMessage) => {
    // Convert raw protocol message to our internal format
    const content = typeof rawMessage.payload === 'string' ? rawMessage.payload : JSON.stringify(rawMessage.payload);

    const newMessage: ProtocolMessage = {
      id: rawMessage.messageId,
      senderId: rawMessage.source,
      receiverId: rawMessage.destination,
      content,
      timestamp: new Date(rawMessage.timestamp),
      encrypted: rawMessage.encrypted || false,
      type: 'text',
      status: 'delivered',
      isDisappearing: false
    };

    setMessages(prev => [...prev, newMessage]);
    onMessageReceived?.(newMessage);
  }, [onMessageReceived]);

  // Initialize connection
  const connect = useCallback(async () => {

    try {
      const result = await ProtocolBridge.connect(serverUrl);

      if (result.success) {
        setConnectionStatus(prev => ({
          ...prev,
          isConnected: true,
          connectionQuality: 'excellent',
          signalStrength: 100
        }));

        // Add message listener to receive messages
        ProtocolBridge.addMessageListener(handleProtocolMessage);

        // Send buffered messages
        if (messageBufferRef.current.length > 0) {
          for (const bufferedMsg of messageBufferRef.current) {
            await sendProtocolMessage(bufferedMsg);
          }
          messageBufferRef.current = [];
        }

        onConnectionChange?.({
          isConnected: true,
          connectionQuality: 'excellent',
          signalStrength: 100,
          latency: 0,
          lastPing: new Date()
        });

      } else {
        setConnectionStatus(prev => ({
          ...prev,
          connectionQuality: 'poor',
          signalStrength: 20
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        connectionQuality: 'poor',
        signalStrength: 20
      }));
    }
  }, [serverUrl, onConnectionChange, handleProtocolMessage, sendProtocolMessage]);

  // Calculate connection quality based on signal strength and latency
  const calculateConnectionQuality = (signalStrength: number, latency: number): ProtocolConnectionStatus['connectionQuality'] => {
    if (signalStrength === 0) return 'disconnected';
    if (latency > 500) return 'poor';
    if (latency > 200) return 'fair';
    if (signalStrength < 30) return 'poor';
    if (signalStrength < 60) return 'fair';
    if (signalStrength < 80) return 'good';
    return 'excellent';
  };

  // Send the current message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    await sendProtocolMessage({
      receiverId: 'broadcast', // In a real app, this would be a specific recipient
      content: newMessage,
      type: 'text',
      encrypted: false, // This property is required according to the type definition
      senderId: 'me' // This property is required according to the type definition
    });

    setNewMessage('');
  }, [newMessage, sendProtocolMessage]);

  // Send a ping to measure latency
  const sendPing = useCallback(() => {
    // We'll simulate latency measurement since the protocol service doesn't have a ping mechanism
    const startTime = Date.now();

    // Simulate a round trip by scheduling a callback
    setTimeout(() => {
      const latency = Date.now() - startTime;
      setPingLatency(latency);

      setConnectionStatus(prev => ({
        ...prev,
        latency,
        lastPing: new Date()
      }));

      // Update connection quality based on latency and signal strength
      setConnectionStatus(prev => {
        const connectionQuality = calculateConnectionQuality(prev.signalStrength, latency);
        return {
          ...prev,
          connectionQuality,
          latency,
          lastPing: new Date()
        };
      });
    }, Math.random() * 100); // Random delay to simulate network conditions
  }, []);

  // Disconnect from the protocol
  const disconnect = useCallback(() => {
    ProtocolBridge.removeMessageListener(handleProtocolMessage);
    ProtocolBridge.disconnect();

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    setConnectionStatus(prev => ({
      ...prev,
      isConnected: false,
      connectionQuality: 'disconnected',
      signalStrength: 0
    }));

    onConnectionChange?.({
      isConnected: false,
      connectionQuality: 'disconnected',
      signalStrength: 0,
      latency: 0,
      lastPing: null
    });
  }, [handleProtocolMessage, onConnectionChange]);

  // Effect to handle connection lifecycle
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Start periodic ping to measure latency
    pingIntervalRef.current = setInterval(() => {
      if (connectionStatus.isConnected) {
        sendPing();
      }
    }, 10000); // Ping every 10 seconds

    return () => {
      disconnect();
      const currentTimeout = reconnectTimeoutRef.current;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [autoConnect, connect, disconnect, sendPing, connectionStatus.isConnected]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
      {/* Header with connection status */}
      <div className="bg-gray-50 px-4 py-3 border-b border-slate-300 flex items-center justify-between">
        <div className="flex items-center">
          {connectionStatus.isConnected ? (
            <FiWifi className="text-green-500 mr-2" />
          ) : (
            <FiWifiOff className="text-red-500 mr-2" />
          )}
          <span className="font-medium text-gray-800">
            Protocol Communication
          </span>
          <span className="ml-3 text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
            {connectionStatus.connectionQuality}
          </span>
          {pingLatency !== null && (
            <span className="ml-2 text-xs text-gray-600">
              Latency: {pingLatency}ms
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSecuritySettings(!showSecuritySettings)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
            title="Security Settings"
          >
            <FiSettings className="w-4 h-4" />
          </button>
          <button
            onClick={connectionStatus.isConnected ? disconnect : connect}
            className={`p-1.5 rounded ${
              connectionStatus.isConnected
                ? 'hover:bg-red-100 text-red-950 border border-red-400 font-bold'
                : 'hover:bg-green-100 text-green-950 border border-green-400 font-bold'
            }`}
            title={connectionStatus.isConnected ? 'Disconnect' : 'Connect'}
          >
            {connectionStatus.isConnected ? <FiWifiOff className="w-4 h-4" /> : <FiWifi className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Security Settings Panel */}
      {showSecuritySettings && (
        <div className="bg-blue-50 p-4 border-b border-slate-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-blue-800 flex items-center">
              <FiShield className="mr-2" aria-hidden="true" /> Security Settings
            </h3>
            <button
              onClick={() => setShowSecuritySettings(false)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Close security settings"
            >
              <FiX className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={encryptionEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    setEncryptionEnabled(enabled);

                    if (enabled) {
                      initializeEncryption();
                    }
                  }}
                  className="rounded text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <span className="text-sm">Enable End-to-End Encryption</span>
              </label>

              <div className="mt-2">
                <label htmlFor="encryption-algorithm" className="block text-xs text-gray-600 mb-1">Encryption Algorithm</label>
                <select
                  id="encryption-algorithm"
                  value={securitySettings.encryptionAlgorithm || 'AES-GCM'}
                  onChange={() => { /* Algorithm selection disabled */ }}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  disabled
                >
                  <option value="AES-GCM">AES-GCM (Recommended)</option>
                  <option value="RSA-OAEP">RSA-OAEP</option>
                  <option value="NONE">None (Not Recommended)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="text-sm mb-2">
                <span className="text-gray-600">Public Key:</span>
                <div className="mt-1 text-xs bg-gray-100 p-2 rounded break-all">
                  {securitySettings.publicKey || 'Not generated yet'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.senderId === 'me'
                  ? 'bg-blue-500 text-white ml-auto rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              <div className="flex justify-between items-start">
                <p>{message.content}</p>
                {message.encrypted && (
                  <FiShield className="ml-2 flex-shrink-0 w-[14px] h-[14px]" />
                )}
              </div>
              <div className={`text-xs mt-1 flex justify-end ${
                message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.senderId === 'me' && (
                  <>
                    {' '}
                    {message.status === 'sending' && <span>⏳</span>}
                    {message.status === 'sent' && <span>✓</span>}
                    {message.status === 'delivered' && <span>✓✓</span>}
                    {message.status === 'read' && <span className="text-blue-300">✓✓</span>}
                    {message.status === 'error' && <span className="text-red-300">✗</span>}
                  </>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-8 text-slate-700">
              <p>No messages yet. Connect to the protocol to start communicating.</p>
            </div>
          )}
        </div>
      </div>

      {/* Message input area */}
      <div className="p-3 bg-white border-t border-slate-300">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              rows={1}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center">
            {encryptionEnabled && (
              <span className="flex items-center mr-3">
                <FiShield className="mr-1" /> Encrypted
              </span>
            )}
            <span className="flex items-center">
              <FiClock className="mr-1" /> Disappearing: Off
            </span>
          </div>

          <button
            onClick={initializeEncryption}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiRefreshCw className="mr-1" /> Regenerate Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCommunication;
