import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';  // Fixed import path
import protocolService from '../services/protocolService';
import { generateRSAKeyPair } from '../utils/cryptoUtils';

// Define types that should be imported from protocolService but are missing
interface ProtocolMessage {
  messageId: string;
  messageType: string;
  source: string;
  destination: string;
  payload: {
    content: string;
    timestamp: string;
    clientId?: string;
    [key: string]: any;
  };
  timestamp: number;
  encrypted?: boolean;
}

interface ProtocolService {
  // eslint-disable-next-line no-unused-vars
  initialize: (clientId: string) => void;
  // eslint-disable-next-line no-unused-vars
  connect: (url: string) => Promise<{ success: boolean; error?: string }>;
  disconnect: () => void;
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  enableEncryption: (publicKey: string, privateKey: string) => void;
  sendGenericMessage: (
    // eslint-disable-next-line no-unused-vars
    destination: string,
    // eslint-disable-next-line no-unused-vars
    messageType: string,
    // eslint-disable-next-line no-unused-vars
    payload: unknown
  ) => Promise<unknown>;
  // eslint-disable-next-line no-unused-vars
  processIncomingMessage: (message: ProtocolMessage) => void;
}

const ProtocolDemoPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { showToast } = useAppContext();
  const [isConnected, setIsConnected] = useState(false);
  const [clientId] = useState(`client-${Math.floor(Math.random() * 10000)}`);
  const [logs, setLogs] = useState<string[]>([]);
  const [messageType, setMessageType] = useState('notification');
  const [messageContent, setMessageContent] = useState('');
  const [destination, setDestination] = useState('server');
  const [isLoading, setIsLoading] = useState(false);
  const [useEncryption, setUseEncryption] = useState(false);

  // Initialize the protocol service
  useEffect(() => {
    (protocolService as unknown as ProtocolService).initialize(clientId);
    addLog(`Protocol service initialized with client ID: ${clientId}`);

    // Cleanup on unmount
    return () => {
      if (isConnected) {
        (protocolService as unknown as ProtocolService).disconnect();
      }
    };
  }, [clientId, isConnected]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      addLog('Connecting to protocol service...');

      // Enable encryption if requested
      if (useEncryption) {
        const { publicKey, privateKey } = await generateRSAKeyPair();
        (protocolService as unknown as ProtocolService).enableEncryption?.(publicKey, privateKey);
        addLog('Encryption enabled for this session');
      }

      const result = await (protocolService as unknown as ProtocolService).connect(
        'wss://api.fingermobileprotocol.com/protocol',
      );

      if (result?.success) {
        setIsConnected(true);
        addLog('Successfully connected to protocol service');
      } else {
        addLog(result?.error || 'Failed to connect to protocol service');
      }
    } catch (error: any) {
      addLog(
        `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    (protocolService as unknown as ProtocolService).disconnect();
    setIsConnected(false);
    addLog('Disconnected from protocol service');
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      addLog('Please enter message content');
      return;
    }

    setIsLoading(true);
    try {
      addLog(
        `Sending message of type: ${messageType} to ${destination}${useEncryption ? ' (encrypted)' : ''}`,
      );

      const response = await (protocolService as unknown as ProtocolService).sendGenericMessage(
        destination,
        messageType,
        {
          content: messageContent,
          timestamp: new Date().toISOString(),
          clientId
        },
      );

      addLog(
        `Message sent successfully. Response: ${JSON.stringify(response)}`,
      );
      setMessageContent('');
    } catch (error: any) {
      addLog(
        `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateIncomingMessage = () => {
    const testMessage: ProtocolMessage = {
      messageId: `sim-msg-${Date.now()}`,
      messageType: 'notification',
      source: 'server',
      destination: clientId,
      payload: {
        type: 'test',
        content: 'This is a simulated incoming message',
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now(),
      encrypted: useEncryption
    };

    (protocolService as unknown as ProtocolService).processIncomingMessage(testMessage);
    addLog('Simulated incoming message processed');
  };

  const getStatusColor = () => {
    return isConnected ? 'text-green-500' : 'text-red-500';
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FingerMobile Protocol Service
          </h1>
          <p className="text-gray-600">
            Demonstration of the custom protocol communication system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Control</h2>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Status:</span>
                <span className={`font-medium ${getStatusColor()}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="text-sm text-slate-700 mb-4">
                <p>Client ID: {clientId}</p>
                <p>Endpoint: wss://api.fingermobileprotocol.com/protocol</p>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="encryption"
                  checked={useEncryption}
                  onChange={(e) => setUseEncryption(e.target.checked)}
                  className="mr-2 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <label htmlFor="encryption">Enable Encryption</label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleConnect}
                disabled={isConnected || isLoading}
                className={`px-4 py-2 rounded-md flex-1 ${
                  isConnected || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>

              <button
                onClick={handleDisconnect}
                disabled={!isConnected || isLoading}
                className={`px-4 py-2 rounded-md flex-1 ${
                  !isConnected || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Message Sending Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Send Message</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  placeholder="Enter destination"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Type
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="notification">Notification</option>
                  <option value="data_request">Data Request</option>
                  <option value="command">Command</option>
                  <option value="event">Event</option>
                  <option value="handshake">Handshake</option>
                  <option value="data_update">Data Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Content
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Enter message content"
                  className="w-full p-2 border border-gray-300 rounded-md h-24 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!isConnected || isLoading}
                className={`px-4 py-2 rounded-md w-full ${
                  !isConnected || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading
                  ? 'Sending...'
                  : `Send Message${useEncryption ? ' (Encrypted)' : ''}`}
              </button>
            </div>
          </div>

          {/* Simulation Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Simulation</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Test how the protocol service handles incoming messages
                </p>

                <button
                  onClick={handleSimulateIncomingMessage}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md w-full"
                >
                  Simulate Incoming Message
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Activity Log</h2>
              <button
                onClick={clearLogs}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              >
                Clear Logs
              </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1 last:mb-0">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-gray-500 h-full flex items-center justify-center">
                  No activity yet. Connect to the protocol service to begin.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProtocolDemoPage;
