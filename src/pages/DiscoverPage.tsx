import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';

import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import PostCard, {
  AiAssistData,
  AiAssistResponse
} from '../components/PostCard';
import { MagnifyingGlassIcon, FireIcon, GiftIcon, LinkIcon, UserCircleIcon } from '../icons';
import type { Post } from '../types';

// --- Subcomponent: Decoupled Tab Navigation ---
interface TabNavigationProps {
  activeTab: string;
  // eslint-disable-next-line no-unused-vars
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = React.memo(({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'latest', label: 'Latest' },
    { id: 'following', label: 'Following' }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

// --- Subcomponent: Decoupled Discovery Actions Panel ---
interface DiscoveryActionsPanelProps {
  // eslint-disable-next-line no-unused-vars
  onOpenGiftModal: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenPaylinkModal: (postId: string) => void;
  ficBalance: number;
}

const DiscoveryActionsPanel: React.FC<DiscoveryActionsPanelProps> = React.memo(({ onOpenGiftModal, onOpenPaylinkModal, ficBalance }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
      <h3 className="text-lg font-bold mb-2">Engage with Content</h3>
      <p className="text-blue-100 text-sm mb-4">
        Interact with posts and support creators
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => onOpenGiftModal('sample-post-id')}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium"
        >
          <GiftIcon className="w-4 h-4" />
          Send Gift
        </button>
        <button
          onClick={() => onOpenPaylinkModal('sample-post-id')}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <LinkIcon className="w-4 h-4" />
          Create Paylink
        </button>
      </div>
      <div className="mt-4 text-xs text-blue-200">
        Your balance: {ficBalance.toFixed(2)} FIC
      </div>
    </div>
  );
});

DiscoveryActionsPanel.displayName = 'DiscoveryActionsPanel';

// --- Subcomponent: Decoupled Discovery Tips Panel ---
const DiscoveryTipsPanel: React.FC = React.memo(() => {
  const tips = [
    'Engage with trending topics',
    'Follow creators in your interests',
    'Share valuable content'
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
      <h3 className="font-bold text-amber-900 tracking-wide mb-3">Discovery Tips</h3>
      <ul className="space-y-2 text-sm font-medium text-amber-800">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-500">✓</span> {tip}
          </li>
        ))}
      </ul>
    </div>
  );
});

DiscoveryTipsPanel.displayName = 'DiscoveryTipsPanel';

// --- Subcomponent: Decoupled FIC Balance Panel ---
interface BalancePanelProps {
  ficBalance: number;
}

const BalancePanel: React.FC<BalancePanelProps> = React.memo(({ ficBalance }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <UserCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
        Your FIC Balance
      </h2>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
        <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700">
          Add Funds
        </button>
      </div>
    </div>
  );
});

BalancePanel.displayName = 'BalancePanel';

// --- Main Container Page Component ---
const DiscoverPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { state: authState } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const user = authState.user; // Access the user from auth state
  const [activeTab, setActiveTab] = useState('discover');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Required functions - matching expected types from PostCard
  // eslint-disable-next-line no-unused-vars
  const onLike = useCallback(async (postId: string) => {
    showToast('Like action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onAddComment = useCallback(async (postId: string, comment: string) => {
    showToast('Comment action triggered', 'info');
  }, [showToast]);

  const onOpenGiftModal = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setShowGiftModal(true);
  }, []);

  const onOpenPaylinkModal = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setShowPaylinkModal(true);
  }, []);

  const onVote = useCallback(async (postId: string, voteType: unknown) => {
    const voteStr = typeof voteType === 'string' ? voteType : 'up';
    showToast(`${voteStr} vote action triggered`, 'info');
  }, [showToast]);

  const handleDeletePost = useCallback(async (postId?: string) => {
    if (!postId) return;
    showToast('Delete post action triggered', 'info');
  }, [showToast]);

  const handleTokenizePost = useCallback(async (postId?: string) => {
    if (!postId) return;
    showToast('Tokenize post action triggered', 'info');
  }, [showToast]);

  const handleAiAssist = useCallback(async (...args: unknown[]): Promise<AiAssistResponse> => {
    // eslint-disable-next-line no-unused-vars
    const action = args[0] as string;
    // eslint-disable-next-line no-unused-vars
    const data = args[1] as AiAssistData;
    showToast('AI assist action triggered', 'info');
    return { success: true, message: 'AI assist completed' };
  }, [showToast]);

  // Mock data initialization
  useEffect(() => {
    // Create mock posts without updatedAt if it doesn't exist in Post type
    const mockPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
      id: `post-${Date.now()}-${i}`,
      authorId: `author-${i}`,
      title: `Post ${i + 1}`,
      content: `This is sample post content ${i + 1}.`,
      body: `This is sample post content ${i + 1}.`,
      excerpt: `This is sample post content ${i + 1}.`,
      type: 'text',
      media: [],
      mediaUrl: '',
      tags: ['sample', 'test'],
      category: 'general',
      status: 'published',
      visibility: 'public',
      isReported: false,
      reportReasons: [],
      reportedBy: [],
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 30),
      createdAt: new Date().toISOString(),
      // Remove updatedAt if it doesn't exist in Post type
    }));

    setPosts(mockPosts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <MainLayout pageTitle="Discover">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          <p className="text-gray-600">Explore trending content and connect with creators</p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <MagnifyingGlassIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Explore
                </h3>
                <ul className="space-y-3">
                  <li><button onClick={() => setActiveTab('trending')} className={`w-full text-left font-medium ${activeTab === 'trending' ? 'text-blue-600 hover:underline' : 'text-gray-600 hover:text-blue-600'}`}>Trending Content</button></li>
                  <li><button onClick={() => setActiveTab('latest')} className={`w-full text-left font-medium ${activeTab === 'latest' ? 'text-blue-600 hover:underline' : 'text-gray-600 hover:text-blue-600'}`}>Latest Posts</button></li>
                  <li><button onClick={() => setActiveTab('following')} className={`w-full text-left font-medium ${activeTab === 'following' ? 'text-blue-600 hover:underline' : 'text-gray-600 hover:text-blue-600'}`}>Following</button></li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FireIcon className="w-5 h-5 text-red-500 mr-2" />
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['#Web3', '#Design', '#AI', '#Startups', '#Tech'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-950 rounded-full text-sm hover:bg-blue-100 hover:text-gray-950 cursor-pointer transition-colors border border-gray-400 font-black">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  _onAddComment={onAddComment} // Change onAddComment to _onAddComment to match PostCardProps
                  onOpenGiftModal={onOpenGiftModal}
                  onOpenPaylinkModal={onOpenPaylinkModal}
                  onVote={onVote}
                  handleDeletePost={handleDeletePost}
                  handleTokenizePost={handleTokenizePost}
                  handleAiAssist={handleAiAssist}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <DiscoveryActionsPanel
              onOpenGiftModal={onOpenGiftModal}
              onOpenPaylinkModal={onOpenPaylinkModal}
              ficBalance={ficBalance}
            />
            <BalancePanel ficBalance={ficBalance} />
            <DiscoveryTipsPanel />
          </div>
        </div>

        {/* Gift Modal */}
        {showGiftModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Send Gift</h3>
              <p className="text-gray-600 mb-4">Send a gift to the creator of this post</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Recipient's membername"
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowGiftModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showToast('Gift sent successfully!');
                      setShowGiftModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg"
                  >
                    Send Gift
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paylink Modal */}
        {showPaylinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Create Paylink</h3>
              <p className="text-gray-600 mb-4">Create a paylink for this post</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Paylink description"
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPaylinkModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showToast('Paylink created successfully!');
                      setShowPaylinkModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg"
                  >
                    Create Paylink
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </MainLayout>
  );
};

export default DiscoverPage;
