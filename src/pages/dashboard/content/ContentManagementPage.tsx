import React, { useContext, useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import PostCard from '../../../components/PostCard';
import { PostContext } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from '../../../types';
import { apiService } from '../../../services/apiService';
import { logError } from '../../../utils/errorLogger';

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
  const [cmsPages, setCmsPages] = useState<any[]>([]);
  const [loadingCms, setLoadingCms] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'cms') {
      setLoadingCms(true);
      apiService.get<any>('/api/content-management')
        .then((res) => {
          const data = res.data?.data || res.data?.pages || res.data;
          if (Array.isArray(data)) {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Manager</h1>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1 text-sm rounded-full ${activeTab === 'posts' ? 'bg-brand-blue text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
            >
              Member Posts
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`px-3 py-1 text-sm rounded-full ${activeTab === 'cms' ? 'bg-brand-blue text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
            >
              Platform CMS Pages
            </button>
          </div>
        </div>
        <button
          onClick={() => openModal('composer')}
          className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700"
        >
          Create New Post
        </button>
      </div>
      {activeTab === 'cms' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 divide-y divide-gray-200">
          {loadingCms ? (
            <div className="p-8 text-center text-slate-700">Loading CMS Pages...</div>
          ) : cmsPages.length > 0 ? (
            cmsPages.map((page: any) => (
              <div key={page.id || page.slug} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">{page.title || page.slug}</h3>
                  <p className="text-sm text-slate-700">/{page.slug} &bull; Status: {page.status || 'published'}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-950 border border-green-400 font-bold font-black">Active</span>
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
            <div className="text-center text-slate-700 py-12 bg-white rounded-xl shadow-sm">
              <p className="font-semibold">
                You haven&apos;t created any posts yet.
              </p>
              <p className="text-sm">Create your first post to see it here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManagementPage;
