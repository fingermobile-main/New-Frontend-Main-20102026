import { useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { getForumCategoryBySlug } from '../utils/forum';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

const CategoryFeedPage: React.FC = () => {
  const { categorySlug, category: paramCat } = useParams<{ categorySlug?: string; category?: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const activeSlug = categorySlug || paramCat || 'general';

  // Get the category fallback data
  const category = getForumCategoryBySlug(activeSlug) || {
    slug: activeSlug,
    name: activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1),
    description: `Discussions and updates in ${activeSlug}`,
    posts: []
  };

  const [posts, setPosts] = useState<Post[]>(category?.posts || []);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const endpoint = activeSlug && activeSlug !== 'all'
      ? `/api/posts?category=${encodeURIComponent(activeSlug)}`
      : '/api/posts';

    apiService.get<any>(endpoint)
      .then((res) => {
        const data = res.data?.data?.posts || res.data?.posts || res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Post[] = data.map((p: any) => ({
            id: String(p.id),
            title: p.title || 'Untitled Post',
            content: p.content || p.body || '',
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
        } else if (category?.posts && category.posts.length > 0) {
          setPosts(category.posts);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        logError(err, { context: 'CategoryFeedPage - Fetch posts' });
        if (category?.posts) setPosts(category.posts);
      })
      .finally(() => setLoading(false));
  }, [activeSlug, category]);

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

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-xs font-black uppercase mb-3">
            Category Feed &bull; {category.name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-slate-700 font-medium text-base sm:text-lg">{category.description}</p>
          )}
        </div>
        <button
          onClick={() => navigate('/forum')}
          className="self-start md:self-auto px-4 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold hover:bg-slate-50 transition-colors"
        >
          &larr; Explore All Categories
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-300">
            <p className="text-slate-800 font-bold text-lg">Loading category posts...</p>
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
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-300 space-y-4">
            <h3 className="text-xl font-black text-slate-900">No posts in this category yet</h3>
            <p className="text-slate-700 font-medium">Be the first to start a conversation in {category.name}!</p>
            <div>
              <button
                onClick={() => navigate('/forum/new')}
                className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                Create First Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFeedPage;
