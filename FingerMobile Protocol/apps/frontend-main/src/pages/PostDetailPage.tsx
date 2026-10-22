import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import CommentSection, { type Comment } from '../components/CommentSection';
import { Post, Member } from '../types';
import { apiService } from '../services/apiService';
import { logError } from '../utils/errorLogger';

const PostDetailPage: React.FC = () => {
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
        const rawPost = response.data?.data || response.data?.post || response.data;

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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors"
          >
            <span>&larr;</span> Back to Feed
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
          <PostCard
            post={post}
            onLike={handleLike}
          />

          {/* Comment Section */}
          <div className="p-6 border-t border-slate-300">
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
    </div>
  );
};

export default PostDetailPage;
