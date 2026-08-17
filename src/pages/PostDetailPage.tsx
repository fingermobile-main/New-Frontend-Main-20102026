import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from "../contexts/AppContext";
import PostCard from '../components/PostCard';
import CommentSection, { type Comment } from '../components/CommentSection';
import { Post, ThreadedComment, Member } from '../types';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    member,
    showToast,
    ficBalance,
    handleAiAssist,
    handleSendMessage
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
    // In a real app, fetch single post by ID
    // For now, we'll simulate getting the post
    const mockPost: Post = {
      id: id || '',
      type: "text",
      content: "This is a sample post for demonstration purposes.",
      author: member || {
        id: "mock-author",
        name: "Mock Author",
        username: "mockuser",
        role: "user",
        permissions: [],
        handle: "mock",
        email: "mock@example.com",
        isSubscribed: false,
        isVerified: false,
        loyaltyTier: "bronze"
      } as Member,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
      bookmarksCount: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isReposted: false,
      tags: [],
      // Additional properties
      title: "Sample Post",
      authorId: "mock-author",
    };

    setPost(mockPost);

    // Mock comments data
    const mockComments: Comment[] = [];
    setComments(mockComments);

    setLoading(false);
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post || !member) return;

    // In a real app, this would be an API call
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
  );
};

export default PostDetailPage;