import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import { useAppContext } from '../../src/contexts/AppContext';
import PostCard from '../../src/components/PostCard';
import CommentSection, { type Comment } from '../../src/components/CommentSection';
import { Post, Member } from '../../src/types';

const PostDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    member,
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
    if (!router.isReady) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const { default: apiService } = await import('../../src/services/apiService');
        const response = await apiService.get(`/api/posts/${id}`);

        if (response.data && response.data.post) {
          setPost(response.data.post);
          if (response.data.comments) setComments(response.data.comments);
        } else {
          throw new Error('Post data format invalid or missing');
        }
      } catch (err) {
        console.error('Failed to fetch live post data, using fallback mock', err);
        // Mock fallback
        const mockPost: Post = {
          id: (id as string) || '',
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
  }, [id, member, router.isReady]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post || !member) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: member,
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
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title || 'Post Detail'} - FingerMobile</title>
      </Head>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <PostCard
            post={post}
            onLike={async () => {}}
          />

          {/* Comment Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
    </>
  );
};

export default PostDetailPage;
