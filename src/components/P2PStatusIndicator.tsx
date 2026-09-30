import React from 'react';
import { motion } from 'framer-motion';
import { useP2PContext } from '../contexts/P2PContext';

interface P2PStatusIndicatorProps {
  status: 'idle' | 'searching' | 'connecting' | 'connected';
  connectionCount?: number;
  speed?: number;
  className?: string;
}

const P2PStatusIndicator: React.FC<P2PStatusIndicatorProps> = ({
  status,
  connectionCount = 0,
  speed = 0,
  className = ''
}) => {
  const { accountType } = useP2PContext();

  const getStatusConfig = () => {
    switch (status) {
    case 'searching':
      return {
        text: 'Searching for peers...',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100',
        dotColor: 'bg-yellow-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        )
      };
    case 'connecting':
      return {
        text: 'Connecting...',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        dotColor: 'bg-blue-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        )
      };
    case 'connected':
      return {
        text: 'Connected',
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        dotColor: 'bg-green-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      };
    default: // idle
      return {
        text: 'Ready',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        dotColor: 'bg-gray-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      };
    }
  };

  const config = getStatusConfig();

  const getAccountBadge = () => {
    if (accountType === 'business') {
      return (
        <div className="flex items-center space-x-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-bold" title="Verified Business (Enterprise)">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Enterprise</span>
        </div>
      );
    }
    if (accountType === 'creator') {
      return (
        <div className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold" title="Professional Creator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Creator</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {getAccountBadge()}
      <div className={`${config.bgColor} ${config.color} px-3 py-1 rounded-full flex items-center space-x-2`}>
        <motion.div
          className={`w-2 h-2 rounded-full ${config.dotColor}`}
          animate={{
            scale: status === 'searching' || status === 'connecting' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: status === 'searching' || status === 'connecting' ? Infinity : 0,
            repeatType: 'loop',
          }}
        />
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </div>

      {connectionCount > 0 && (
        <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span>{connectionCount} peers</span>
        </div>
      )}

      {speed > 0 && (
        <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.873A5.99 5.99 0 0111 14c-.566 0-1.078-.12-1.542-.374a10 10 0 00-.443.284A3 3 0 0112.12 15.12z" clipRule="evenodd" />
          </svg>
          <span>{speed.toFixed(1)}x</span>
        </div>
      )}
    </div>
  );
};

export default P2PStatusIndicator;
