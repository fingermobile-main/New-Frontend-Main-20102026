import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Shield,
  FileText,
  ShoppingCart,
  DollarSign,
  Activity,
  Bell,
  Mail,
  Grid3X3,
  UsersRound,
} from 'lucide-react';
import { LightBulbIcon, VideoCameraIcon } from '../icons';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard cards with direct links to various sections
  const dashboardCards: DashboardCard[] = [
    {
      id: 'master-dashboard',
      title: 'Master Dashboard',
      description: 'Platform-wide management and oversight',
      icon: Grid3X3,
      route: '/master-dashboard',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600'
    },
    {
      id: 'stercs-dashboard',
      title: 'STERCS Dashboard',
      description: 'Specialized governance and control systems',
      icon: LightBulbIcon,
      route: '/stercs-dashboard',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-600'
    },
    {
      id: 'analytics',
      title: 'Analytics Console',
      description: 'Track platform performance and user engagement metrics',
      icon: BarChart3,
      route: '/advancedanalytics',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      id: 'moderation',
      title: 'Content Moderation Console',
      description: 'Monitor and manage user-generated content',
      icon: Shield,
      route: '/contentmoderator',
      color: 'bg-gradient-to-r from-purple-500 to-fuchsia-600'
    },
    {
      id: 'members',
      title: 'Member Management',
      description: 'Manage platform members and their accounts',
      icon: Users,
      route: '/user-management',
      color: 'bg-gradient-to-r from-cyan-500 to-sky-600'
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage platform content and publications',
      icon: FileText,
      route: '/dashboard/content',
      color: 'bg-gradient-to-r from-rose-500 to-pink-600'
    },
    {
      id: 'commerce',
      title: 'E-commerce',
      description: 'Manage products, orders, and payments',
      icon: ShoppingCart,
      route: '/storefronttracking',
      color: 'bg-gradient-to-r from-orange-500 to-red-600'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Manage groups, forums, and interactions',
      icon: MessageSquare,
      route: '/communitymanagement',
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600'
    },
    {
      id: 'settings',
      title: 'Platform Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      route: '/settings-hub',
      color: 'bg-gradient-to-r from-gray-500 to-slate-600'
    },
    {
      id: 'monetization',
      title: 'Monetization',
      description: 'Manage revenue streams and monetization tools',
      icon: DollarSign,
      route: '/monetizationdashboard',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-600'
    },
    {
      id: 'live-streaming',
      title: 'Live Streaming',
      description: 'Manage live streaming and broadcast features',
      icon: VideoCameraIcon,
      route: '/livestreaming',
      color: 'bg-gradient-to-r from-red-500 to-rose-600'
    },
    {
      id: 'membership',
      title: 'Membership',
      description: 'Manage membership plans and subscriptions',
      icon: UsersRound,
      route: '/subscriptions',
      color: 'bg-gradient-to-r from-indigo-500 to-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-xs border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                Platform Management
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Mail className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-xs">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-slate-300">
          <nav className="flex space-x-8">
            {['overview', 'recent', 'favorites'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-1 border-b-2 font-bold text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-700 hover:text-slate-950 hover:border-slate-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardCards.map(card => {
            const isLightBg = card.color.includes('yellow') || card.color.includes('amber');
            return (
              <Link
                key={card.id}
                to={card.route}
                className="block transform transition-transform duration-200 hover:scale-105"
              >
                <div className={`${card.color} rounded-xl shadow-lg p-6 ${isLightBg ? 'text-slate-950' : 'text-white'} hover:shadow-xl transition-shadow`}>
                  <div className="flex items-center">
                    <div className={`p-3 ${isLightBg ? 'bg-black/15' : 'bg-white bg-opacity-20'} rounded-lg`}>
                      {React.createElement(card.icon, { className: `h-6 w-6 ${isLightBg ? 'text-slate-950' : 'text-white'}` })}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`text-lg font-black ${isLightBg ? 'text-slate-950' : 'text-white'}`}>{card.title}</h3>
                      <p className={`text-xs mt-1 ${isLightBg ? 'text-slate-950 font-bold' : 'text-white/95 font-medium'}`}>{card.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className={`inline-flex items-center text-xs font-black ${isLightBg ? 'text-slate-950 hover:underline' : 'text-white hover:underline'}`}>
                      Access Console
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-slate-900 mb-6">Quick Platform Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-xs p-6 border border-slate-300">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Members</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">2,842,901</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">↑ 12.5% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs p-6 border border-slate-300">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Activity className="h-6 w-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Sessions</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">142,832</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">↑ 8.3% from yesterday</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs p-6 border border-slate-300">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">₦42.8M</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">↑ 15.2% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs p-6 border border-slate-300">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Content Posts</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">12.4M</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">↑ 5.7% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Added ChevronRight icon since it wasn't imported
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default DashboardPage;
