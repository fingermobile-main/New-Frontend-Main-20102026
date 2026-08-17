import { useNavigate, useParams} from 'react-router-dom';
import React, { useState } from 'react';


import { useAppContext } from "../contexts/AppContext";

import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { getForumCategoryBySlug } from '../utils/forum';

const CategoryFeedPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Get the category data
  const category = getForumCategoryBySlug(categorySlug || "");

  const [ficBalance, setFicBalance] = useState<number>(0);

  // Required placeholder functions
  const onLike = (postId: string) => {
    showToast(`Like action triggered for ${postId}`, "info");
  };

  const onAddComment = () => {
    showToast("Add comment action triggered", "info");
  };

  const onOpenGiftModal = () => {
    showToast("Gift modal opened", "info");
  };

  const onOpenPaylinkModal = () => {
    showToast("Paylink modal opened", "info");
  };

  const onVote = () => {
    showToast("Vote action triggered", "info");
  };

  const handleDeletePost = () => {
    showToast("Delete post action triggered", "info");
  };

  const handleTokenizePost = () => {
    showToast("Tokenize post action triggered", "info");
  };

  const handleAiAssist = () => {
    showToast("AI assist action triggered", "info");
    return Promise.resolve({ success: true });
  };

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Category not found</h2>
        <p className="mt-2 text-gray-600">
          The category you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/forum")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          Return to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {category.posts?.map((post: Post) => (
          <PostCard
            key={typeof post.id === 'string' ? post.id : String(post.id)}
            post={post}
            onLike={() => onLike(typeof post.id === 'string' ? post.id : String(post.id))}
            _onAddComment={onAddComment} // Changed from onAddComment to _onAddComment
            onOpenGiftModal={onOpenGiftModal}
            onOpenPaylinkModal={onOpenPaylinkModal}
            onVote={onVote}
            handleDeletePost={handleDeletePost}
            handleTokenizePost={handleTokenizePost}
            handleAiAssist={handleAiAssist}
          />
        ))}

        {(!category.posts || category.posts.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts in this category yet.</p>
            <button
              onClick={() => navigate("/forum/new")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            >
              Create First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFeedPage;