import { useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { getForumCategoryBySlug } from '../utils/forum';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

const CategoryFeedPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Get the category fallback data
  const category = getForumCategoryBySlug(categorySlug || '');

  const [posts, setPosts] = useState<Post[]>(category?.posts || []);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!categorySlug) return;
    setLoading(true);
    apiService.get<any>(`/api/posts?category=${encodeURIComponent(categorySlug)}`)
      .then((res) => {
        const data = res.data?.data?.posts || res.data?.posts || res.data;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Post[] = data.map((p: any) => ({
            id: String(p.id),
            title: p.title || 'Untitled Post',
            content: p.content || '',
            author: p.author_name || p.author || 'Anonymous',
            timestamp: p.created_at || new Date().toISOString(),
            createdAt: p.created_at || new Date().toISOString(),
            likes: Number(p.likes_count || 0),
            comments: Array.isArray(p.comments) ? p.comments : [],
            tags: Array.isArray(p.tags) ? p.tags : [],
            verified: false,
            moderated: true,
            hasLiked: false,
            replies: Number(p.replies_count || 0),
            views: Number(p.views_count || 0)
          }));
          setPosts(mapped);
        } else if (category?.posts) {
          setPosts(category.posts);
        }
      })
      .catch((err) => {
        logError(err, { context: 'CategoryFeedPage - Fetch posts' });
        if (category?.posts) setPosts(category.posts);
      })
      .finally(() => setLoading(false));
  }, [categorySlug, category]);

  const onLike = async (postId: string) => {
    try {
      await apiService.post(`/api/posts/${postId}/like`);
      setPosts(prev => prev.map(p => {
        if (String(p.id) === String(postId)) {
          return { ...p, likes: (p.likes || 0) + 1, hasLiked: true };
        }
        return p;
      }));
      showToast('Liked post!', 'success');
    } catch (err) {
      showToast('Liked post (local)', 'info');
    }
  };

  const onAddComment = () => {
    showToast('Add comment action triggered', 'info');
  };

  const onOpenGiftModal = () => {
    showToast('Gift modal opened', 'info');
  };

  const onOpenPaylinkModal = () => {
    showToast('Paylink modal opened', 'info');
  };

  const onVote = () => {
    showToast('Vote action triggered', 'info');
  };

  const handleDeletePost = () => {
    showToast('Delete post action triggered', 'info');
  };

  const handleTokenizePost = () => {
    showToast('Tokenize post action triggered', 'info');
  };

  const handleAiAssist = () => {
    showToast('AI assist action triggered', 'info');
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
          onClick={() => navigate('/forum')}
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-700 font-medium">Loading category posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post: Post) => (
            <PostCard
              key={typeof post.id === 'string' ? post.id : String(post.id)}
              post={post}
              onLike={() => onLike(typeof post.id === 'string' ? post.id : String(post.id))}
              _onAddComment={onAddComment}
              onOpenGiftModal={onOpenGiftModal}
              onOpenPaylinkModal={onOpenPaylinkModal}
              onVote={onVote}
              handleDeletePost={handleDeletePost}
              handleTokenizePost={handleTokenizePost}
              handleAiAssist={handleAiAssist}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts in this category yet.</p>
            <button
              onClick={() => navigate('/forum/new')}
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
