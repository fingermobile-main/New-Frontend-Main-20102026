import React, { useEffect, useState, useMemo } from 'react';

import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import TrendsFeed from '../components/TrendsFeed';
import { FireIcon, UserCircleIcon, HeartIcon, ChatBubbleLeftRightIcon, GiftIcon, LinkIcon } from '../icons';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

interface PostType {
  id: string;
  contentImageUrl?: string;
  [key: string]: any;
}

interface TrendsFeedPageProps {
  posts?: any[]; // Making posts optional to allow default empty array
  // eslint-disable-next-line no-unused-vars
  handleLikePost?: (postId: string) => void; // Making optional
  // eslint-disable-next-line no-unused-vars
  handleOpenGiftModal?: (post: any) => void; // Making optional
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  showToast?: (message: React.ReactNode, type?: 'error' | 'success' | 'warning' | 'info') => void; // Making optional
}

const TrendsFeedPage: React.FC<TrendsFeedPageProps> = ({
  posts: propsPosts = [],
  // eslint-disable-next-line no-unused-vars
  handleLikePost: propsHandleLikePost = () => {},
  // eslint-disable-next-line no-unused-vars
  handleOpenGiftModal: propsHandleOpenGiftModal = () => {},
  // eslint-disable-next-line no-unused-vars
  showToast: propsShowToast = () => {}
}) => {
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const { openModal, showToast: contextShowToast, ficBalance } = useAppContext();
  const [posts, setLocalPosts] = useState<PostType[]>(propsPosts);

  useEffect(() => {
    if (propsPosts && propsPosts.length > 0) {
      setLocalPosts(propsPosts);
    } else {
      apiService.get<any>('/api/trends')
        .then((res) => {
          const data = res.data?.data || res.data;
          if (Array.isArray(data) && data.length > 0) {
            setLocalPosts(data);
          }
        })
        .catch((err) => {
          logError(err, { context: 'TrendsFeedPage - Fetch trends' });
        });
    }
  }, [propsPosts]);

  const trendingSource = useMemo(
    () => posts.filter((p) => p.contentImageUrl),
    [posts],
  );
  // eslint-disable-next-line no-unused-vars
  const [trendPosts, setTrendPosts] = useState<PostType[]>(trendingSource);

  useEffect(() => {
    setTrendPosts(trendingSource);
  }, [trendingSource]);

  const handleLikePost = (postId: string) => {
    setTrendPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const likesCount = p.likesCount + (isLiked ? 1 : -1);
          return { ...p, isLiked, likesCount };
        }
        return p;
      }),
    );
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl shadow-md">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Trends Feed
              </h1>
              <p className="text-slate-700 font-medium">
                Discover the most popular and trending content in the community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Component JSX */}
            <TrendsFeed
              trends={posts as any}
              onTrendClick={(trendId) => handleLikePost(trendId)}
              limit={10}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-orange-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3 py-1.5 rounded-lg hover:from-orange-600 hover:to-amber-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-amber-50 transition-colors flex items-center">
                  <HeartIcon className="h-5 w-5 text-orange-600 mr-3" />
                  Like Content
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-amber-50 transition-colors flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-600 mr-3" />
                  Comment
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-amber-50 transition-colors flex items-center">
                  <GiftIcon className="h-5 w-5 text-orange-600 mr-3" />
                  Send Gift
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-amber-50 transition-colors flex items-center">
                  <LinkIcon className="h-5 w-5 text-orange-600 mr-3" />
                  Create Paylink
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Trending Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Engage with trending topics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Share valuable content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Follow trending creators</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrendsFeedPage;
