import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  SparklesIcon,
  TrendingUpIcon
} from '../icons';
import { Users, Flame, Award, Compass, MessageSquare } from 'lucide-react';

const ContentCommunityDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <MainLayout pageTitle="Community Dashboard">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -mb-20 -ml-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-2xl flex items-center justify-center border border-fuchsia-200 shadow-inner">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Insights</h1>
              <p className="text-slate-700 font-medium mt-1">Monitor engagement, top contributors, and trending discussions.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
            <select className="w-full sm:w-auto min-h-[44px] bg-white border-2 border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl focus:ring-fuchsia-500 focus:border-fuchsia-500 block p-3 font-bold shadow-sm">
              <option>All Communities</option>
              <option>Web3 Developers</option>
              <option>DeFi Enthusiasts</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {[
            { label: 'Active Members', value: '8,432', change: '+124 this week', icon: <UserGroupIcon className="w-6 h-6 text-fuchsia-500" />, color: 'fuchsia' },
            { label: 'Total Discussions', value: '45.2K', change: '+892 this week', icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-violet-500" />, color: 'violet' },
            { label: 'Community Health', value: '98%', change: 'Excellent', icon: <HeartIcon className="w-6 h-6 text-emerald-500" />, color: 'emerald' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-slate-700 font-medium text-sm mt-1">{stat.label}</p>
                <p className={`text-xs font-bold mt-2 ${stat.color === 'emerald' ? 'text-emerald-500' : 'text-slate-600 font-medium'}`}>{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Trending Discussions */}
          <div id="trends-section" className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FireIcon className="w-6 h-6 text-orange-500" />
                 Trending Discussions
              </h2>
              <Link to="/communities" className="text-sm font-bold text-fuchsia-600 hover:text-fuchsia-700">View All</Link>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { title: 'The future of Layer 2 solutions in 2026', replies: 342, likes: 1205, community: 'Web3 Developers' },
                { title: 'How to effectively manage risk in DeFi', replies: 289, likes: 843, community: 'DeFi Enthusiasts' },
                { title: 'Introductions: Welcome to the new members!', replies: 156, likes: 432, community: 'General' },
                { title: 'Weekly technical analysis and market overview', replies: 112, likes: 320, community: 'Trading' }
              ].map((topic, i) => (
                <Link
                  to="/communities"
                  key={i}
                  className="block p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors mb-2">{topic.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                    <span className="bg-white px-2 py-1 rounded-md border border-slate-200">{topic.community}</span>
                    <span className="flex items-center gap-1"><ChatBubbleLeftRightIcon className="w-3.5 h-3.5" /> {topic.replies}</span>
                    <span className="flex items-center gap-1"><HeartIcon className="w-3.5 h-3.5" /> {topic.likes}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div id="contributors-section" className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-amber-500" />
                 Top Contributors
              </h2>
              <select className="bg-white border border-slate-200 text-slate-900 text-xs rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2 font-medium font-bold border-slate-300 focus:ring-2">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { name: 'Alex Chen', handle: '@alexc', rep: '15.4K', avatar: 'AC', color: 'fuchsia' },
                { name: 'Sarah Jenkins', handle: '@sarahj', rep: '12.8K', avatar: 'SJ', color: 'emerald' },
                { name: 'David Kim', handle: '@dkim', rep: '10.2K', avatar: 'DK', color: 'blue' },
                { name: 'Emily Rogers', handle: '@emilyr', rep: '9.5K', avatar: 'ER', color: 'amber' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 bg-${user.color}-100 text-${user.color}-600 rounded-xl flex items-center justify-center font-bold text-lg`}>
                        {user.avatar}
                      </div>
                      {i < 3 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        {user.name}
                        <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                      </p>
                      <p className="text-xs text-slate-700 font-medium">{user.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{user.rep}</p>
                    <p className="text-xs text-slate-700 font-medium">Reputation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Insights"
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Insights</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('trends-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Trends"
          >
            <TrendingUpIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Trends</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('contributors-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Top"
          >
            <StarIcon className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-semibold mt-0.5">Top</span>
          </button>
          <button
            onClick={() => navigate('/communities')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Guilds"
          >
            <UserGroupIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Guilds</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContentCommunityDashboardPage;
