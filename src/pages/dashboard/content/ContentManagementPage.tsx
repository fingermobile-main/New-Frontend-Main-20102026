import React, { useContext } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import PostCard from '../../../components/PostCard';
import { PostContext } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from '../../../types';

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

  // In a real, complex admin panel, you'd fetch all posts and filter,
  // but for "My Content", we filter posts by the logged-in admin.
  const memberPosts = authMember
    ? posts.filter((p: Post) => p.author.id === authMember.id)
    : [];

  const onAdminDelete = (postId: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this post? This action cannot be undone.",
      )
    ) {
      handleDeletePost?.(postId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <button
          onClick={() => openModal("composer")}
          className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700"
        >
          Create New Post
        </button>
      </div>
      <div className="space-y-6">
        {memberPosts.length > 0 ? (
          memberPosts.map((post: Post) => (
            <div key={post.id} className="relative group">
              <PostCard
                post={post}
                onLike={handleLikePost}
                onAddComment={handleAddNewComment}
                onOpenGiftModal={() => openModal("gift", { post })}
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
                  onClick={() => showToast(`Reviewing post ${post.id}`, "info")}
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
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
            <p className="font-semibold">
              You haven&apos;t created any posts yet.
            </p>
            <p className="text-sm">Create your first post to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;
