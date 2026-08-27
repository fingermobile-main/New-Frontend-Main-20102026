import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';

// Define types locally since they're not properly exported
interface ProtocolMessage {
  messageId: string;
  source: string;
  destination: string;
  messageType: string;
  payload: any;
  timestamp: number;
  encryption?: {
    algorithm: string;
    key: string;
  };
}

class MockProtocolService {
  private connected = false;

  async initialize() {
    console.log("Mock protocol service initialized");
  }

  async connect(connectionInfo: {host: string, port: number}) {
    console.log(`Mock connecting to ${connectionInfo.host}:${connectionInfo.port}`);
    this.connected = true;
    return { success: true, connectionId: `conn_${Date.now()}` };
  }

  async disconnect() {
    console.log("Mock disconnecting");
    this.connected = false;
    return { success: true };
  }

  async sendGenericMessage(message: ProtocolMessage) {
    console.log("Mock sending message:", message);
    return { success: true, messageId: message.messageId, timestamp: Date.now() };
  }

  processIncomingMessage(message: any) {
    console.log("Mock processing incoming message:", message);
  }
}

const ProtocolDemoPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [isConnected, setIsConnected] = useState(false);
  const [clientId] = useState(`client-${Math.floor(Math.random() * 10000)}`);
  const [logs, setLogs] = useState<string[]>([]);
  const [destination, setDestination] = useState('server');
  const [messageType, setMessageType] = useState('chat');
  const [messageContent, setMessageContent] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [protocolService, setProtocolService] = useState<MockProtocolService | null>(null);

  // Initialize protocol service
  useEffect(() => {
    const initProtocol = async () => {
      try {
        const service = new MockProtocolService();
        await service.initialize();
        setProtocolService(service);
        addLog("Protocol service initialized");
      } catch (error: any) {
        addLog(`Failed to initialize protocol: ${error.message}`);
      }
    };

    initProtocol();
    
    return () => {
      // Cleanup
      if (protocolService) {
        // We can't call disconnect here since we don't want to disconnect during unmount
      }
    };
  }, []);

  const addLog = useCallback((log: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${log}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  const connectToServer = async () => {
    if (!protocolService) {
      addLog("Protocol service not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const result = await protocolService.connect({
        host: "api.fingermobile.com",
        port: 443
      });
      setIsConnected(true);
      addLog("Connected to server successfully");
      showToast("Connected to server", "success");
    } catch (error: any) {
      addLog(`Connection failed: ${error.message}`);
      showToast("Connection failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromServer = async () => {
    if (!protocolService) {
      addLog("Protocol service not initialized");
      return;
    }

    try {
      await protocolService.disconnect();
      setIsConnected(false);
      addLog("Disconnected from server");
    } catch (error: any) {
      addLog(`Disconnection failed: ${error.message}`);
    }
  };

  const sendMessage = async () => {
    if (!protocolService) {
      addLog("Protocol service not initialized");
      return;
    }

    if (!messageContent.trim()) {
      addLog("Please enter message content");
      return;
    }

    setIsLoading(true);
    try {
      addLog(
        `Sending message of type: ${messageType} to ${destination}${useEncryption ? " (encrypted)" : ""}`,
      );
      
      // Fixed: Properly structured message with required fields
      const message: ProtocolMessage = {
        messageId: `msg-${Date.now()}`,
        source: clientId,
        destination,
        messageType,
        payload: {
          content: messageContent,
          timestamp: new Date().toISOString(),
          clientId
        },
        timestamp: Date.now(),
        encryption: useEncryption ? { algorithm: 'AES-256', key: 'temp-key' } : undefined
      };
      
      const response = await protocolService.sendGenericMessage(message);
      
      addLog(
        `Message sent successfully. Response: ${JSON.stringify(response)}`,
      );
      setMessageContent("");
    } catch (error: any) {
      addLog(
        `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const simulateIncomingMessage = () => {
    if (protocolService) {
      const testMessage = {
        source: "simulator",
        type: "test",
        content: "Test incoming message",
        timestamp: new Date().toISOString()
      };
      protocolService.processIncomingMessage(testMessage);
      addLog("Simulated incoming message processed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Protocol Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the protocol service capabilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Connection Management</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={connectToServer}
                disabled={isConnected || isLoading}
                className={`px-4 py-2 rounded transition-colors ${
                  isConnected 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
              
              <button
                onClick={disconnectFromServer}
                disabled={!isConnected || isLoading}
                className={`px-4 py-2 rounded transition-colors ${
                  !isConnected 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isLoading 
                      ? 'bg-red-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Disconnect
              </button>
            </div>
            
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Message Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter destination"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message Type
              </label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="chat">Chat</option>
                <option value="notification">Notification</option>
                <option value="data">Data Transfer</option>
                <option value="command">Command</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="encryption"
                checked={useEncryption}
                onChange={(e) => setUseEncryption(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="encryption" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Use Encryption
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Send Message</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message Content
            </label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your message..."
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!isConnected || isLoading || !messageContent.trim()}
            className={`px-4 py-2 rounded transition-colors ${
              !isConnected || !messageContent.trim()
                ? 'bg-gray-300 cursor-not-allowed' 
                : isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Simulate Incoming Message</h2>
        <button
          onClick={simulateIncomingMessage}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Simulate Message
        </button>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Activity Log</h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-200 dark:border-gray-700">
                {log}
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 py-4 text-center">
              No activity yet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolDemoPage;
