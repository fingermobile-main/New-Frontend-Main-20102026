import React, { useEffect, useState } from 'react';
import { blogService, BlogComment } from '../../services/blogService';

interface CommentThreadProps {
  postId: string;
  currentUserId?: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleStartEdit = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editContent, is_edited: true } : c));
    setEditingCommentId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await blogService.getComments(postId);
      setComments(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (parentId: string | null = null) => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await blogService.createComment(postId, newComment, parentId || undefined);

      setNewComment('');
      setReplyTo(null);
      loadComments();
    } catch (err) {
      setError('Failed to submit comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderComment = (comment: BlogComment, depth: number = 0) => {
    const isOwner = currentUserId === comment.author_id;
    const maxDepth = 3; // Limit nesting depth

    return (
      <div key={comment.id} className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white rounded-lg p-4 border border-slate-300">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {comment.author_avatar ? (
                <img
                  src={comment.author_avatar}
                  alt={comment.author_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {comment.author_name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}

              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {comment.author_name || 'Anonymous'}
                </p>
                <p className="text-xs text-slate-700">{formatDate(comment.created_at || comment.createdAt)}</p>
              </div>
            </div>

            {comment.is_edited && (
              <span className="text-xs text-slate-700 italic">edited</span>
            )}
          </div>

          {/* Comment Content */}
          {editingCommentId === comment.id ? (
            <div className="mb-3 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveEdit(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCommentId(null)}
                  className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Comment Actions */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <button
              type="button"
              aria-label={`Like comment by ${comment.author_name || 'Anonymous'}`}
              onClick={() => handleLikeComment(comment.id)}
              className={`hover:text-blue-600 transition-colors ${likedComments[comment.id] ? 'text-red-500 font-bold' : ''}`}
            >
              ❤️ {(comment.likes_count || 0) + (likedComments[comment.id] ? 1 : 0)}
            </button>

            {currentUserId && depth < maxDepth && (
              <button
                type="button"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="hover:text-blue-600 transition-colors"
              >
                💬 Reply
              </button>
            )}

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => handleStartEdit(comment)}
                  className="hover:text-blue-600 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="hover:text-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSubmitComment(comment.id)}
                  disabled={submitting || !newComment.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadComments}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* New Comment Form */}
      {currentUserId && (
        <div className="bg-white rounded-lg p-4 border border-slate-300">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleSubmitComment(null)}
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-slate-700">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
