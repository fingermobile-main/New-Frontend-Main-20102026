import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { useAppContext } from '../contexts/AppContext';
import {
  PencilIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  HeartIcon
} from '../icons';

const ContentCreatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Videos' | 'Articles'>('All');
  return (
    <MainLayout pageTitle="Creator Studio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mb-20 -ml-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-inner">
              <PencilIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Creator Studio</h1>
              <p className="text-slate-700 font-medium mt-1">Manage your content, track performance, and grow your audience.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => showToast('Displaying 3 saved unpublished drafts', 'info')}
              className="px-5 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
               Drafts (3)
            </button>
            <Link
              to="/createpost"
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-colors shadow-md flex items-center gap-2"
            >
              <PencilIcon className="w-5 h-5" />
               Create Content
            </Link>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {[
            { label: 'Total Views', value: '128.4K', change: '+15.2%', icon: <EyeIcon className="w-6 h-6 text-blue-500" />, color: 'blue' },
            { label: 'Engagement Rate', value: '8.4%', change: '+1.2%', icon: <HeartIcon className="w-6 h-6 text-rose-500" />, color: 'rose' },
            { label: 'New Followers', value: '1,245', change: '+450', icon: <UserGroupIcon className="w-6 h-6 text-emerald-500" />, color: 'emerald' },
            { label: 'Estimated Earnings', value: '24.5 FIC', change: '+5.2 FIC', icon: <CurrencyDollarIcon className="w-6 h-6 text-amber-500" />, color: 'amber' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50`}>
                  {stat.icon}
                </div>
                <span className={'text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg'}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-slate-700 font-medium text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Recent Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Content</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFilter('All')}
                    className={`px-3 py-1.5 text-sm font-bold rounded-lg border transition-colors ${filter === 'All' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('Videos')}
                    className={`px-3 py-1.5 text-sm font-bold rounded-lg border transition-colors ${filter === 'Videos' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                  >
                    Videos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('Articles')}
                    className={`px-3 py-1.5 text-sm font-bold rounded-lg border transition-colors ${filter === 'Articles' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                  >
                    Articles
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Building scalable dApps on FingerMobile Protocol', type: 'Video', views: '12.4K', likes: '842', date: '2 days ago', icon: <VideoCameraIcon className="w-5 h-5 text-indigo-500" />, color: 'indigo' },
                  { title: 'Top 5 DeFi strategies for beginners', type: 'Article', views: '8.2K', likes: '512', date: '5 days ago', icon: <DocumentTextIcon className="w-5 h-5 text-amber-500" />, color: 'amber' },
                  { title: 'Why I switched to decentralized social media', type: 'Video', views: '24.1K', likes: '1.2K', date: '1 week ago', icon: <VideoCameraIcon className="w-5 h-5 text-indigo-500" />, color: 'indigo' },
                  { title: 'Understanding Zero-Knowledge Proofs', type: 'Article', views: '5.6K', likes: '345', date: '2 weeks ago', icon: <DocumentTextIcon className="w-5 h-5 text-amber-500" />, color: 'amber' }
                ]
                  .filter((c) => filter === 'All' || (filter === 'Videos' && c.type === 'Video') || (filter === 'Articles' && c.type === 'Article'))
                  .map((content, i) => (
                  <Link
                    key={i}
                    to={content.type === 'Video' ? '/dancia4tv' : '/blogs'}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-4 mb-3 sm:mb-0">
                      <div className={`w-10 h-10 bg-${content.color}-50 rounded-xl flex items-center justify-center shrink-0`}>
                        {content.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{content.title}</h3>
                        <p className="text-xs text-slate-700 font-medium mt-1">{content.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600 pl-14 sm:pl-0">
                      <div className="flex items-center gap-1.5">
                        <EyeIcon className="w-4 h-4 text-slate-600" /> {content.views}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HeartIcon className="w-4 h-4 text-slate-600" /> {content.likes}
                      </div>
                      <button
                        type="button"
                        aria-label={`View detailed metrics for ${content.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate('/earnings/analytics');
                        }}
                        className="p-2 text-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <ChartBarIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <h2 className="text-xl font-black mb-6 relative z-10">Monetization</h2>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-6 relative z-10">
                <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
                <p className="text-3xl font-black">142.50 FIC</p>
              </div>

              <div className="space-y-3 relative z-10">
                <Link
                  to="/wallet"
                  className="block text-center w-full py-3.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
                >
                     Withdraw Funds
                </Link>
                <Link
                  to="/earnings"
                  className="block text-center w-full py-3.5 bg-transparent text-white font-bold rounded-xl border border-white/30 hover:bg-white/10 transition-colors"
                >
                     View Earnings History
                </Link>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Content Tips</h2>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-300 text-sm font-bold">
                  <div className="mt-0.5">💡</div>
                  <p>Videos between 3-5 minutes have the highest retention rate this week.</p>
                </div>
                <div className="flex gap-3 p-3 bg-blue-50 text-blue-950 rounded-xl border border-blue-300 text-sm font-bold">
                  <div className="mt-0.5">📈</div>
                  <p>Articles with 'DeFi' in the title are trending in your community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </div>
    </MainLayout>
  );
};

// Add missing icon
const UserGroupIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export default ContentCreatorDashboardPage;
