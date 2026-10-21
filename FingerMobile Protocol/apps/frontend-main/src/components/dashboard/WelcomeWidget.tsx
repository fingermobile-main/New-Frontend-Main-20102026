import React, {} from 'react';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

interface WelcomeWidgetProps {
  userName?: string;
}

const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ userName = 'User' }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-3">
        <HandRaisedIcon className="w-8 h-8" />
        <h2 className="text-2xl font-bold">Welcome back, {userName}!</h2>
      </div>
      <p className="text-sm opacity-90">Here's what's happening with your platform today.</p>
    </div>
  );
};

export default WelcomeWidget;
