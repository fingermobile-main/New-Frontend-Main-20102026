/*
 * FingerMobile Protocol™ - PhotoCredits Interactive Comments Modal
 * Community Discussion, Threaded Commentary & Creator Monetization Points Engine
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Heart,
  Sparkles,
  User,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export interface CommentItem {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  isCreator?: boolean;
}

interface PhotoCreditsCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: {
    id: string;
    title: string;
    photographer: string;
    imageUrl: string;
    thumbnailUrl?: string;
  } | null;
  commentsCount: number;
  onAddComment: (itemId: string, text: string) => void;
}

const DEFAULT_COMMENTS: Record<string, CommentItem[]> = {
  default: [
    {
      id: 'c-1',
      author: 'Amina Bello (Curator)',
      text: 'The lighting on this capture is mesmerizing! The skin textures and fabric dynamics are truly 8K masterclass standard.',
      timestamp: '2 hours ago',
      likes: 18,
      hasLiked: false
    },
    {
      id: 'c-2',
      author: 'Marcus Vance (Pro)',
      text: 'Superb 85mm optical separation. The golden hour bokeh gives an incredible sovereign editorial vibe.',
      timestamp: '5 hours ago',
      likes: 12,
      hasLiked: false
    },
    {
      id: 'c-3',
      author: 'Chidi Okonkwo (Collector)',
      text: 'Acquiring the Extended Commercial License today for our African luxury brand campaign. Proud to support the 80% creator royalty model!',
      timestamp: '1 day ago',
      likes: 24,
      hasLiked: true
    }
  ]
};

export const PhotoCreditsCommentsModal: React.FC<PhotoCreditsCommentsModalProps> = ({
  isOpen,
  onClose,
  mediaItem,
  commentsCount,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<CommentItem[]>(DEFAULT_COMMENTS.default);

  if (!isOpen || !mediaItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-user-${Date.now()}`,
      author: 'You (Sovereign Member)',
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      hasLiked: false
    };

    setCommentsList([newComment, ...commentsList]);
    onAddComment(mediaItem.id, commentText.trim());
    setCommentText('');
  };

  const handleToggleLike = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked: nextLiked,
            likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Community Commentary
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
                  {commentsList.length} Comments
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Engage & boost creator sovereign monetization score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Snippet */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
          <img
            src={mediaItem.thumbnailUrl || mediaItem.imageUrl}
            alt={mediaItem.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-800"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-xs truncate">{mediaItem.title}</h4>
            <p className="text-[11px] text-slate-300 font-medium truncate">
              By <span className="text-sky-400 font-bold">{mediaItem.photographer}</span>
            </p>
          </div>
        </div>

        {/* Comments Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {commentsList.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-[10px]">
                    {c.author.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-200">{c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                </div>
                <button
                  onClick={() => handleToggleLike(c.id)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                    c.hasLiked
                      ? 'text-red-400 bg-red-950/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${c.hasLiked ? 'fill-red-400' : ''}`} />
                  <span>{c.likes}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed pl-8">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-800 flex-shrink-0 space-y-2">
          <div className="relative">
            <textarea
              rows={2}
              required
              placeholder="Leave artistic feedback, critique or appreciation..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 pr-10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white transition-all shadow-md"
              title="Post Comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1 text-sky-400 font-bold">
              <Sparkles className="w-3 h-3" />
              +6 Sovereign Monetization Points per Comment
            </span>
            <span>Markdown supported</span>
          </div>
        </form>
      </div>
    </div>
  );
};
