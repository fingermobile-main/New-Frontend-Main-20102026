import React, {} from 'react';
import { SignalIcon } from '@heroicons/react/24/solid';

interface P2PStatusIndicatorProps {
  status?: 'online' | 'offline' | 'connecting' | 'error';
  peerCount?: number;
}

const P2PStatusIndicator: React.FC<P2PStatusIndicatorProps> = ({ 
  status = 'offline',
  peerCount = 0
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Offline';
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        {status === 'connecting' && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-500 animate-ping"></div>
        )}
      </div>
      
      <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
      
      {peerCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">• {peerCount} peers</span>
      )}
      
      <SignalIcon className={`w-4 h-4 ${
        status === 'online' ? 'text-green-500' :
        status === 'connecting' ? 'text-yellow-500' :
        status === 'error' ? 'text-red-500' :
        'text-gray-400'
      }`} />
    </div>
  );
};

export default P2PStatusIndicator;
