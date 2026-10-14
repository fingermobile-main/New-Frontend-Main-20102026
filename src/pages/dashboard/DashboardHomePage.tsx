import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from '../../components/StatCard';
import TrendCard from '../../components/TrendCard';
import PostCard from '../../components/PostCard';
import { useWeb3 } from '../../contexts/Web3Context';

// Mock data for dashboard
const mockStats = [
  { title: 'Total Earnings', value: '2,450', subtitle: 'FIC', color: 'green' },
  {
    title: 'Content Views',
    value: '12.4K',
    subtitle: 'This month',
    color: 'blue'
  },
  {
    title: 'New Followers',
    value: '342',
    subtitle: 'This month',
    color: 'purple'
  },
  {
    title: 'Tokenized Items',
    value: '24',
    subtitle: 'Active tokens',
    color: 'indigo'
  }
];

const mockTrends = [
  {
    id: '1',
    title: 'Your content is performing 15% above average',
    category: 'Performance',
    热度: 85,
    views: 1250
  },
  {
    id: '2',
    title: 'New followers milestone reached',
    category: 'Growth',
    热度: 92,
    views: 2100
  },
  {
    id: '3',
    title: 'Top performing post this week',
    category: 'Content',
    热度: 78,
    views: 3400
  }
];

const mockPosts = [
  {
    id: '101',
    type: 'text' as const,
    author: {
      id: '1',
      name: 'You',
      membername: 'creator',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    timestamp: '2023-06-15T14:30:00Z',
    createdAt: '2023-06-15T14:30:00Z',
    title: 'New Album Release!',
    content:
      'Excited to announce my new album "Digital Dreams" is now available on all platforms! This project represents months of work blending electronic sounds with organic instruments.',
    contentImageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    likesCount: 245,
    repliesCount: 32,
    repostsCount: 18,
    bookmarksCount: 89,
    isLiked: false,
    isTokenized: true,
    guardianFlag: null,
    pollOptions: null
  },
  {
    id: '102',
    type: 'text' as const,
    author: {
      id: '1',
      name: 'You',
      membername: 'creator',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    timestamp: '2023-06-10T09:15:00Z',
    createdAt: '2023-06-10T09:15:00Z',
    title: '',
    content:
      'Working on some new tracks today. The creative process is so therapeutic. What helps you get into a creative flow?',
    contentImageUrl: '',
    likesCount: 178,
    repliesCount: 42,
    repostsCount: 9,
    bookmarksCount: 56,
    isLiked: true,
    isTokenized: false,
    guardianFlag: null,
    pollOptions: null
  }
];

const DashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { balance } = useWeb3();
  const [stats] = useState(mockStats);
  const [trends] = useState(mockTrends);
  const [posts, setPosts] = useState(mockPosts);
  const [timeRange, setTimeRange] = useState('7d');

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
    showToast('Post reaction updated', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Creator Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your content performance and earnings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              color={stat.color as string}
            />
          ))}
        </div>

        {/* Trends and Wallet Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Trends & Insights</h2>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      timeRange === range
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {trends.map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} rank={index + 1} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-6">Wallet Balance</h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {balance.toLocaleString()}{' '}
                <span className="text-lg text-gray-500">FIC</span>
              </p>
              <p className="text-gray-500 mt-2">
                ≈ $
                {(balance * 0.1).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}{' '}
                USD
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/master-dashboard?tab=financials&subtab=fiat-rules')}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Withdraw Funds
                </button>
                <button
                  onClick={() => navigate('/master-dashboard?tab=financials&subtab=cic-ledger')}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Transaction History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Content</h2>
            <button
              onClick={() => navigate('/forum')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  pollOptions: post.pollOptions || []
                }}
                onLike={(postId) => handleLikePost(postId)}
                _onAddComment={() => showToast('Opening comment dialog', 'info')}
                onOpenGiftModal={() => showToast('Opening creator gift tray', 'info')}
                onVote={() => showToast('Vote submitted successfully', 'success')}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/createpost')}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Create Post</span>
            </button>

            <button
              onClick={() => navigate('/stercs')}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Upload Media</span>
            </button>

            <button
              onClick={() => navigate('/subscriptions')}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Monetize Content</span>
            </button>

            <button
              onClick={() => navigate('/advancedanalytics')}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-slate-900">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
