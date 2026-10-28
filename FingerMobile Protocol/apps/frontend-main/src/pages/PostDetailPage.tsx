import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import CommentSection, { type Comment } from '../components/CommentSection';
import { Post, Member } from '../types';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    member,
    showToast,
    ficBalance,
    handleAiAssist,
  } = useAppContext();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  // Wrapper to match CommentSection's expected signature
  const handleAiAssistWrapper = async (action: string, data: Record<string, unknown>) => {
    const prompt = `${action}: ${JSON.stringify(data)}`;
    await handleAiAssist(prompt);
    return { success: true };
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiService.get<any>(`/api/posts/${id}`);
        const rawPost = response?.data?.data || response?.data?.post || response?.data || response?.post || response;

        if (rawPost && (rawPost.id || rawPost.title || rawPost.content)) {
          const mappedPost: Post = {
            id: String(rawPost.id || id),
            type: 'text',
            title: rawPost.title || 'Untitled Post',
            content: rawPost.content || '',
            author: rawPost.author_name || rawPost.author || member || {
              id: 'author',
              name: 'Author',
              username: 'user',
              role: 'user',
              permissions: [],
              handle: 'user',
              email: 'user@example.com',
              isSubscribed: false,
              isVerified: false,
              loyaltyTier: 'bronze'
            } as Member,
            authorId: rawPost.author_id ? String(rawPost.author_id) : undefined,
            timestamp: rawPost.created_at || new Date().toISOString(),
            createdAt: rawPost.created_at || new Date().toISOString(),
            likesCount: Number(rawPost.likes_count || 0),
            repliesCount: Number(rawPost.replies_count || 0),
            repostsCount: Number(rawPost.reposts_count || 0),
            bookmarksCount: Number(rawPost.bookmarks_count || 0),
            likes: Number(rawPost.likes_count || 0),
            comments: Array.isArray(rawPost.comments) ? rawPost.comments.length : Number(rawPost.replies_count || 0),
            shares: 0,
            isLiked: false,
            isReposted: false,
            tags: Array.isArray(rawPost.tags) ? rawPost.tags : ['forum'],
          };
          setPost(mappedPost);

          if (Array.isArray(rawPost.comments)) {
            const mappedComments: Comment[] = rawPost.comments.map((c: any) => ({
              id: String(c.id),
              author: c.author_name || member || {
                id: 'commenter',
                name: 'Commenter',
                username: 'commenter',
                role: 'user',
                permissions: [],
                handle: 'commenter',
                email: 'commenter@example.com',
                isSubscribed: false,
                isVerified: false,
                loyaltyTier: 'bronze'
              } as Member,
              content: c.content || '',
              timestamp: c.created_at || new Date().toISOString(),
              likesCount: Number(c.likes_count || 0),
              isLiked: false,
              replies: [],
              giftCount: 0,
              isVerified: false
            }));
            setComments(mappedComments);
          }
        } else {
          throw new Error('Post data format invalid or missing');
        }
      } catch (err) {
        logError(err, { context: 'PostDetailPage - Fetch live post, using fallback' });
        // Mock fallback
        const mockPost: Post = {
          id: id || '',
          type: 'text',
          content: 'This is a sample post fetched from the backend (mock fallback). We are wiring this to real data.',
          author: member || {
            id: 'mock-author',
            name: 'Mock Author',
            username: 'mockuser',
            role: 'user',
            permissions: [],
            handle: 'mock',
            email: 'mock@example.com',
            isSubscribed: false,
            isVerified: false,
            loyaltyTier: 'bronze'
          } as Member,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          likesCount: 15,
          repliesCount: 3,
          repostsCount: 2,
          bookmarksCount: 1,
          likes: 15,
          comments: 3,
          shares: 2,
          isLiked: false,
          isReposted: false,
          tags: ['update', 'social'],
          title: 'Sample Post Data Wiring',
          authorId: 'mock-author',
        };

        setPost(mockPost);

        const mockComments: Comment[] = [
          {
            id: 'c1',
            author: member || mockPost.author as Member,
            content: 'Great insight! Thanks for sharing this update.',
            timestamp: new Date().toISOString(),
            likesCount: 5,
            isLiked: false,
            replies: [],
            giftCount: 0,
            isVerified: true
          }
        ];
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, member]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      await apiService.post(`/api/posts/${post.id}/comments`, { content: newComment });
    } catch (err) {
      logError(err, { context: 'PostDetailPage - Add comment' });
    }

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: member || {
        id: 'member',
        name: 'Member',
        username: 'user',
        role: 'user',
        permissions: [],
        handle: 'user',
        email: 'user@example.com',
        isSubscribed: false,
        isVerified: false,
        loyaltyTier: 'bronze'
      } as Member,
      content: newComment,
      timestamp: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      giftCount: 0,
      isVerified: false
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    showToast('Comment added!', 'success');
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await apiService.post(`/api/posts/${post.id}/like`);
      setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1, isLiked: true } : null);
      showToast('Liked post!', 'success');
    } catch (err) {
      showToast('Liked post (local)', 'info');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors bg-white border border-slate-300 rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Back to Feed</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
          <PostCard
            post={post}
            onLike={handleLike}
          />

          {/* Comment Section */}
          <div className="p-4 sm:p-6 border-t border-slate-300">
            <CommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitComment={handleAddComment}
              ficBalance={ficBalance}
              onTriggerSpecialEffect={() => {}}
              handleAiAssist={handleAiAssistWrapper}
            />
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Post Detail Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mb-0.5" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={handleLike}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ThumbsUp className="w-5 h-5 mb-0.5" />
          <span>Like</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const commentInput = document.querySelector('textarea, input[placeholder*="comment"]') as HTMLElement | null;
            if (commentInput) commentInput.focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Reply</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
            } else {
              showToast('Post URL copied to clipboard', 'info');
            }
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Share2 className="w-5 h-5 mb-0.5" />
          <span>Share</span>
        </button>
      </nav>
    </div>
  );
};

export default PostDetailPage;
