import React from 'react';
import { HomeIcon, ShoppingBagIcon, WalletIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const MemberLandingPage: React.FC = () => {
  // Mock data for the landing page
  const quickActions = [
    {
      id: 1,
      title: 'View feed',
      subtitle: 'catch up',
      icon: <HomeIcon className="h-4 w-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/15',
      borderColor: 'hover:border-orange-500/50'
    },
    {
      id: 2,
      title: 'Marketplace',
      subtitle: 'shop / sell',
      icon: <ShoppingBagIcon className="h-4 w-4" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'hover:border-yellow-500/50'
    },
    {
      id: 3,
      title: 'Wallet',
      subtitle: '₦3.9M',
      icon: <WalletIcon className="h-4 w-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/15',
      borderColor: 'hover:border-orange-500/50'
    },
    {
      id: 4,
      title: 'Learning',
      subtitle: 'continue course',
      icon: <AcademicCapIcon className="h-4 w-4" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'hover:border-yellow-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <nav className="flex items-center gap-6 px-6 py-4 border-b border-gray-700">
        <span className="font-bold text-[15px]">
          Finger<span className="text-orange-500">Mobile</span>
        </span>
        <div className="flex-1"></div>
        <a className="text-[13px] text-gray-400 hover:text-gray-100">Discover</a>
        <a className="text-[13px] text-gray-400 hover:text-gray-100">About</a>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-gray-900 text-[12px] font-bold">
          Open app
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <span className="text-[10px] text-gray-400">PROTOCOL LANDING · MEMBER</span>
        <h1 className="text-[34px] mt-3 font-bold leading-tight">
          Welcome to your <span className="text-orange-500">unified</span> FingerMobile
        </h1>
        <p className="text-[14px] text-gray-400 mt-3 max-w-xl mx-auto">
          Feed, commerce, finance and learning — all under one fingerprint. What would you like to do first?
        </p>
        
        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 text-left">
          {quickActions.map(action => (
            <a 
              key={action.id} 
              className={`bg-gray-800 border border-gray-700 rounded-2xl p-4 cursor-pointer ${action.borderColor}`}
            >
              <span className={`grid w-9 h-9 place-items-center rounded-xl ${action.bgColor} ${action.color}`}>
                {action.icon}
              </span>
              <p className="text-[13px] font-bold mt-3">{action.title}</p>
              <p className="text-[11px] text-gray-400">{action.subtitle}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberLandingPage;