import React, {} from 'react';
import { Member } from '../types';

export interface Comment {
  id: string;
  author: string | Member;
  content: string;
  timestamp: string;
  likesCount?: number;
  isLiked?: boolean;
  replies?: Comment[];
  giftCount?: number;
  isVerified?: boolean;
}

interface CommentSectionProps {
  postId?: string; // Added postId prop to identify which post to comment on
  comments: Comment[];
  newComment?: string;
  setNewComment?: (comment: string) => void;
  onSubmitComment?: (e: React.FormEvent) => void;
  onAddComment?: (postId: string, commentText: string) => void; // Updated to expect postId
  ficBalance?: number;
  handleAiAssist?: (action: string, data: Record<string, unknown>) => Promise<{ success: boolean }>;
  onTriggerSpecialEffect?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId,  // Extract postId from props
  comments, 
  newComment,
  setNewComment,
  onSubmitComment,
  onAddComment,
  ficBalance,
  handleAiAssist,
  onTriggerSpecialEffect
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddComment && newComment && postId) {
      // Call onAddComment with both postId and comment text
      onAddComment(postId, newComment);
      if (setNewComment) {
        setNewComment(''); // Clear the input after submitting
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (setNewComment) {
      setNewComment(e.target.value);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <div>
        {comments.map(comment => (
          <div key={comment.id}>
            <p>{typeof comment.author === 'string' ? comment.author : comment.author.name}: {comment.content}</p>
          </div>
        ))}
      </div>
      {onAddComment && setNewComment && postId && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={handleChange}
            placeholder="Add a comment..."
            className="w-full border rounded px-3 py-2" />
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;