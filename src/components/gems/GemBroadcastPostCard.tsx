import React, { useState, useEffect } from 'react';
import { BroadcastPost } from './types';
import { emojiPackService } from '../../services/emojiPackService';
import {
  Clock,
  Radio,
  Send,
  EyeOff,
  Bot,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface GemBroadcastPostCardProps {
  post: BroadcastPost;
  onIgnore: (postId: number | string) => void;
  onDirectReply: (postId: number | string, replyText: string) => void;
  onTriggerAutoReply: (post: BroadcastPost) => void;
  onViewAnalytics: (post: BroadcastPost) => void;
  onReaction?: (postId: number | string, emoji: string) => void;
}

export const GemBroadcastPostCard: React.FC<GemBroadcastPostCardProps> = ({
  post,
  onIgnore,
  onDirectReply,
  onTriggerAutoReply,
  onViewAnalytics,
  onReaction
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; expired: boolean }>({
    hours: 24,
    minutes: 0,
    expired: false
  });
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isIgnored, setIsIgnored] = useState(false);

  // Calculate 24-hour TTL remaining
  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const expires = new Date(post.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, expired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, minutes, expired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [post.expires_at]);

  // Word count helper for 60 words maximum
  const wordCount = post.content_text.trim() ? post.content_text.trim().split(/\s+/).length : 0;

  // Banner gradient theme
  const getBannerGradient = () => {
    switch (post.banner_style) {
      case 'emerald-sovereign':
        return 'from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/40 hover:border-emerald-400/60 shadow-emerald-950/30';
      case 'sunset-amber':
        return 'from-amber-950/80 via-slate-900 to-slate-900 border-amber-500/40 hover:border-amber-400/60 shadow-amber-950/30';
      case 'cyber-amethyst':
        return 'from-fuchsia-950/80 via-slate-900 to-slate-900 border-fuchsia-500/40 hover:border-fuchsia-400/60 shadow-fuchsia-950/30';
      case 'neon-sapphire':
      default:
        return 'from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500/40 hover:border-indigo-400/60 shadow-indigo-950/30';
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    setTimeout(() => {
      onDirectReply(post.id, replyText);
      setReplyText('');
      setIsReplying(false);
      setIsSubmittingReply(false);
    }, 400);
  };

  if (isIgnored) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-between transition-all">
        <span className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-slate-300 font-medium" />
          Broadcast by @{post.username || 'creator'} dismissed from your living room feed.
        </span>
        <button
          onClick={() => setIsIgnored(false)}
          className="text-purple-400 hover:text-purple-300 text-xs font-semibold cursor-pointer underline"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <article
      aria-label={`Broadcast message by ${post.username || 'creator'}`}
      className={`relative rounded-3xl bg-gradient-to-b ${getBannerGradient()} border p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col justify-between`}
    >
      {/* Top Header Bar: Channel Destination & 24h TTL Badge */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 border border-slate-700/80 text-purple-300 shadow-inner">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              {post.channel_name || '#general-living-room'}
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              60 Words Max Post Card Banner
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 24-Hour TTL Expiration Clock */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
                timeLeft.expired
                  ? 'bg-red-950/80 text-red-300 border-red-500/40'
                  : timeLeft.hours <= 3
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {timeLeft.expired ? 'Expired (24h TTL)' : `${timeLeft.hours}h ${timeLeft.minutes}m left`}
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <img
              src={
                post.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt={post.username || 'Creator'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">
                  {post.first_name ? `${post.first_name}` : `@${post.username || 'creator'}`}
                </h4>
                <span title="Verified Broadcast Channel">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Ephemeral Broadcast • 24h P2P Digital Living Room
              </p>
            </div>
          </div>

          {/* Word Count Indicator */}
          <div className="text-right">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                wordCount > 60
                  ? 'bg-red-950/80 text-red-300 border-red-500/40'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800'
              }`}
            >
              {wordCount} / 60 words
            </span>
          </div>
        </div>

        {/* Rich Text 60 Words Maximum Post Card Body */}
        <div className="relative rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4 mb-4 backdrop-blur-md">
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed selection:bg-purple-600 selection:text-white">
            {post.content_text}
          </p>
        </div>

        {/* Media Attachment (Image / Video) */}
        {post.media_urls && post.media_urls.length > 0 && post.media_urls[0] && (
          <div className="relative rounded-2xl overflow-hidden mb-4 border border-slate-800/80 shadow-lg group">
            {post.media_type === 'video' || post.media_urls[0].endsWith('.mp4') ? (
              <video
                src={post.media_urls[0]}
                controls
                className="w-full max-h-72 object-cover bg-black"
              />
            ) : (
              <img
                src={post.media_urls[0]}
                alt="Broadcast banner attachment"
                className="w-full max-h-72 object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            )}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-slate-300 font-semibold border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              Rich Media Post Card
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls & Power Tools Bar */}
      <div>
        {/* Follower Reactions Bar with Official 5D Mint Green Glass Emojis */}
        <div className="pt-3 pb-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            {emojiPackService.getReactionEmojis().map((brandEmoji) => {
              const count = post.reactions?.[brandEmoji.slug] || post.reactions?.[brandEmoji.name] || 0;
              return (
                <button
                  key={brandEmoji.id}
                  onClick={() => onReaction && onReaction(post.id, brandEmoji.slug)}
                  title={brandEmoji.name}
                  className="px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-400/50 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 group"
                >
                  <img
                    src={brandEmoji.imageUrl}
                    alt={brandEmoji.name}
                    className="w-4 h-4 rounded-full object-cover group-hover:scale-110 transition-transform"
                  />
                  {count > 0 && <span className="text-[11px] font-bold text-emerald-400">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Sender Analytics Response Button */}
          <button
            onClick={() => onViewAnalytics(post)}
            className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
            <span>Sender Analytics Response</span>
          </button>
        </div>

        {/* Receiver Response Power Tools: Ignore, Reply, Auto-Reply */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-xs text-slate-300 font-semibold">
            Receiver Action:
          </span>

          <div className="flex items-center gap-2">
            {/* Action 1: Ignore */}
            <button
              onClick={() => {
                setIsIgnored(true);
                onIgnore(post.id);
              }}
              title="Ignore and hide this broadcast"
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-300" />
              <span>Ignore</span>
            </button>

            {/* Action 2: Direct Reply */}
            <button
              onClick={() => setIsReplying(!isReplying)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                isReplying
                  ? 'bg-slate-800 border-purple-500 text-white'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>{isReplying ? 'Cancel Reply' : 'Direct Reply'}</span>
            </button>

            {/* Action 3: Use Auto-Reply */}
            <button
              onClick={() => onTriggerAutoReply(post)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-200" />
              <span>Use Auto-Reply</span>
            </button>
          </div>
        </div>

        {/* Inline Direct Reply Form */}
        {isReplying && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 animate-fade-in space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply();
                }}
                placeholder={`Reply directly to @${post.username || 'creator'}...`}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendReply}
                disabled={isSubmittingReply || !replyText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmittingReply ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-purple-400" />
              Direct replies route into the member’s sovereign living room inbox.
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
