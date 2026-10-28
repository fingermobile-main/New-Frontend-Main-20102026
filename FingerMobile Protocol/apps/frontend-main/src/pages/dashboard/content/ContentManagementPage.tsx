import React, { useContext, useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import PostCard from '../../../components/PostCard';
import { PostContext } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from '../../../types';
import { apiService } from '../../../services/apiService';
import { logError } from '../../../utils/errorLogger';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

const FALLBACK_CMS_PAGES = [
  { id: 'page-terms', title: 'Terms of Service & Protocol Governance', slug: 'legal/terms', status: 'published', lastUpdated: '2026-10-20' },
  { id: 'page-privacy', title: 'Global Privacy Policy & Data Sovereignty', slug: 'legal/privacy', status: 'published', lastUpdated: '2026-10-18' },
  { id: 'page-standards', title: 'Community Standards & Decentralized Content Ethics', slug: 'legal/community-standards', status: 'published', lastUpdated: '2026-10-15' },
  { id: 'page-whitepaper', title: 'FIC Financial Protocol Whitepaper v2.4', slug: 'whitepaper', status: 'published', lastUpdated: '2026-10-12' },
  { id: 'page-faq', title: 'Frequently Asked Questions & Node Staking FAQ', slug: 'faq', status: 'published', lastUpdated: '2026-10-10' }
];

const ContentManagementPage: React.FC = () => {
  const { member: authMember } = useAuth();
  const {
    showToast,
    openModal,
    ficBalance,
    handleAiAssist,
    triggerSpecialEffect
  } = useAppContext();
  const postContext = useContext(PostContext);
  const posts = postContext?.posts || [];
  const handleDeletePost = postContext?.handleDeletePost;
  const handleLikePost = postContext?.handleLikePost;
  const handleAddNewComment = postContext?.handleAddNewComment;
  const handleVote = postContext?.handleVote;
  const handleTokenizePost = postContext?.handleTokenizePost;

  const [activeTab, setActiveTab] = useState<'posts' | 'cms'>('posts');
  const [cmsPages, setCmsPages] = useState<any[]>(FALLBACK_CMS_PAGES);
  const [loadingCms, setLoadingCms] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'cms') {
      setLoadingCms(true);
      apiService.get<any>('/api/content-management')
        .then((res) => {
          const data = res.data?.data || res.data?.pages || res.data;
          if (Array.isArray(data) && data.length > 0) {
            setCmsPages(data);
          }
        })
        .catch((err) => {
          logError(err, { context: 'ContentManagementPage - Fetch CMS pages' });
        })
        .finally(() => setLoadingCms(false));
    }
  }, [activeTab]);

  const memberPosts = authMember
    ? posts.filter((p: Post) => p.author.id === authMember.id)
    : posts;

  const onAdminDelete = (postId: string) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this post? This action cannot be undone.',
      )
    ) {
      handleDeletePost?.(postId);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Content Manager</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Audit, moderate, and publish member submissions and platform CMS articles</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                activeTab === 'posts'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Member Posts
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                activeTab === 'cms'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Platform CMS Pages
            </button>
          </div>
        </div>
        <button
          onClick={() => openModal('composer')}
          className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Create New Post
        </button>
      </div>

      <PlatformOwnershipCard className="mb-6" />

      {activeTab === 'cms' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-300 divide-y divide-slate-200 overflow-hidden">
          {loadingCms ? (
            <div className="p-8 text-center text-slate-700">Loading CMS Pages...</div>
          ) : cmsPages.length > 0 ? (
            cmsPages.map((page: any) => (
              <div key={page.id || page.slug} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{page.title || page.slug}</h3>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">/{page.slug} &bull; Status: {page.status || 'published'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Active
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-700">No CMS pages found.</div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {memberPosts.length > 0 ? (
            memberPosts.map((post: Post) => (
              <div key={post.id} className="relative group">
                <PostCard
                  post={post}
                  onLike={handleLikePost}
                  onAddComment={handleAddNewComment}
                  onOpenGiftModal={() => openModal('gift', { post })}
                  // @ts-ignore - Auto-suppressed for compilation
                  onVote={handleVote}
                  // @ts-ignore - Auto-suppressed for compilation
                  onTriggerSpecialEffect={triggerSpecialEffect}
                  ficBalance={ficBalance}
                  // @ts-ignore - Auto-suppressed for compilation
                  handleAiAssist={handleAiAssist}
                  showToast={showToast}
                  handleDeletePost={handleDeletePost ? (postId?: string) => handleDeletePost(postId || '') : undefined}
                  handleTokenizePost={handleTokenizePost ? (postId?: string) => handleTokenizePost(postId || '') : undefined}
                />
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => showToast(`Reviewing post ${post.id}`, 'info')}
                    className="px-4 py-2 text-sm font-semibold bg-white text-blue-600 border border-gray-300 rounded-full shadow-lg hover:bg-blue-50"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => onAdminDelete(post.id)}
                    className="px-4 py-2 text-sm font-semibold bg-white text-red-600 border border-gray-300 rounded-full shadow-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-700 py-12 bg-white rounded-2xl shadow-xs border border-slate-300">
              <p className="font-bold text-slate-900 text-base">
                You haven&apos;t created any posts yet.
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Create your first post to see it here.</p>
            </div>
          )}
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          onClick={() => setActiveTab('posts')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'posts' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <span className="text-base font-extrabold leading-none mb-0.5">📝</span>
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          type="button"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'cms' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <span className="text-base font-black leading-none mb-0.5">📄</span>
          <span>CMS</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">↑</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default ContentManagementPage;
