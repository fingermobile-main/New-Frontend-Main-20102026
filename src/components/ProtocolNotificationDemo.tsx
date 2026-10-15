import React, { useState } from 'react';
import { useProtocolNotifications, protocolNotificationService } from '../services/protocolNotificationService';
import protocolService from '../services/protocolService';

const ProtocolNotificationDemo: React.FC = () => {
  const [clientId, setClientId] = useState(`client-${Date.now()}`);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [logs, setLogs] = useState<string[]>([]);

  // Initialize protocol notifications
  useProtocolNotifications();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleInitialize = () => {
    protocolService.initialize(clientId);
    addLog(`Protocol service initialized with client ID: ${clientId}`);
  };

  const handleConnect = async () => {
    try {
      addLog('Attempting to connect to protocol...');
      const success = await protocolService.connectToProtocol();

      if (success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        addLog('Successfully connected to protocol!');
      } else {
        addLog('Failed to connect to protocol');
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      addLog(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDisconnect = () => {
    protocolService.disconnectProtocol();
    setIsConnected(false);
    setConnectionStatus('disconnected');
    addLog('Disconnected from protocol');
  };

  const simulateError = () => {
    // Simulate an error notification
    protocolNotificationService.notifyError(new Error('Simulated error for demonstration'));
    addLog('Simulated error notification triggered');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Protocol Connection Notifications Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleInitialize}
              disabled={isConnected}
              className={`px-4 py-2 rounded-md ${
                isConnected
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Initialize
            </button>

            <button
              onClick={handleConnect}
              disabled={isConnected}
              className={`px-4 py-2 rounded-md ${
                isConnected
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Connect
            </button>

            <button
              onClick={handleDisconnect}
              disabled={!isConnected}
              className={`px-4 py-2 rounded-md ${
                !isConnected
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Disconnect
            </button>

            <button
              onClick={simulateError}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
            >
              Simulate Error
            </button>

            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-slate-300">
          <h3 className="font-medium text-gray-800 mb-2">Connection Status</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus === 'connected'
              ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
              : connectionStatus === 'disconnected'
                ? 'bg-red-100 text-red-950 border border-red-400 font-bold'
                : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
          }`}>
            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Current State</h3>
            <p>Client ID: {clientId}</p>
            <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">Activity Log</h3>
          <span className="text-sm text-gray-500">{logs.length} entries</span>
        </div>

        <div className="bg-gray-50 rounded-md border border-slate-300 h-64 overflow-y-auto p-4 font-mono text-sm">
          {logs.length > 0 ? (
            <ul className="space-y-1">
              {logs.map((log, index) => (
                <li key={index} className="py-1 border-b border-gray-100 last:border-0">
                  {log}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No activity yet. Perform actions to see logs here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolNotificationDemo;
