/*
 * FingerMobile Protocol™ - PhotoCreditCard Component
 * Modern high-contrast card with Share, Save to My Gallery, Bookmark, Favorites, and AI Inspector
 * Strictly adheres to Workspace Contrast Rules (text-slate-900, text-slate-800, text-slate-700, border-slate-300)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  FolderHeart,
  Bookmark,
  Star,
  Download,
  Film,
  ShieldCheck,
  MapPin,
  Cpu
} from 'lucide-react';
import type { PhotoCredit } from '../types';

export interface ExtendedPhotoCreditItem extends Partial<PhotoCredit> {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  media_type?: 'image' | 'video';
  cost?: number;
  creditCost?: number;
  price_credits?: number;
  photographer?: string;
  location?: string;
  category?: string;
  cohort?: string;
  likes?: number;
  comments?: number;
  saves?: number;
  shares?: number;
  downloads?: number;
  rating?: number;
  aiScore?: number;
  isSaved?: boolean;
  isBookmarked?: boolean;
  isFavorite?: boolean;
  hasLiked?: boolean;
  poll_data?: any;
}

/* eslint-disable no-unused-vars */
interface PhotoCreditCardProps {
  item: ExtendedPhotoCreditItem;
  onLike?: (itemId: string) => void;
  onAddComment?: (itemId: string) => void;
  onShare?: (item: ExtendedPhotoCreditItem) => void;
  onSaveToGallery?: (item: ExtendedPhotoCreditItem) => void;
  onBookmark?: (item: ExtendedPhotoCreditItem) => void;
  onToggleFavorite?: (item: ExtendedPhotoCreditItem) => void;
  onInspectAi?: (item: ExtendedPhotoCreditItem) => void;
  onOpenGiftModal?: (itemId: string) => void;
  onOpenPaylinkModal?: (itemId: string) => void;
  onVote?: (itemId: string) => void;
  onStreamVideo?: (item: ExtendedPhotoCreditItem) => void;
  onAcquireLicense?: (item: ExtendedPhotoCreditItem) => void;
}
/* eslint-enable no-unused-vars */

export const PhotoCreditCard: React.FC<PhotoCreditCardProps> = ({
  item,
  onLike,
  onAddComment,
  onShare,
  onSaveToGallery,
  onBookmark,
  onToggleFavorite,
  onInspectAi,
  onStreamVideo,
  onAcquireLicense
}) => {
  const isVideo = item.media_type === 'video' || Boolean(item.videoUrl);
  const price = item.price_credits ?? item.creditCost ?? item.cost ?? 25;
  const photographerName = item.photographer || (item.uploader as any)?.name || 'FingerMobile Verified Creator';
  const aiScore = item.aiScore ?? Math.min(99, Math.round(((item.rating || 4.9) / 5) * 100));

  return (
    <div className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Media Canvas */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        <img
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isVideo && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
              <Film className="w-3 h-3" /> 4K UHD
            </span>
          )}
          {item.location && (
            <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-[11px] font-bold text-slate-100 border border-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {item.location}
            </span>
          )}
          {item.category && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
              {item.category}
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: Favorite & AI Inspector */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => onInspectAi?.(item)}
            className="p-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/50 text-amber-300 hover:text-white transition shadow-sm flex items-center gap-1 text-[10px] font-bold px-2"
            title="Inspect Autonomous AI Quality Breakdown (The Science & The Art)"
          >
            <Cpu className="w-3 h-3 text-amber-400" />
            <span>{aiScore}%</span>
          </button>

          <button
            onClick={() => onToggleFavorite?.(item)}
            className={`p-1.5 rounded-xl backdrop-blur-md border transition shadow-sm ${
              item.isFavorite
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-950/85 border-slate-700 text-slate-200 hover:text-amber-400'
            }`}
            title={item.isFavorite ? 'In Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        {/* Bottom Price & Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/30">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {item.rating || 4.9}
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-lg">
            🪙 {price} FIC
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {item.title}
            </h3>

            {/* Quick Save & Bookmark Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onSaveToGallery?.(item)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  item.isSaved
                    ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600'
                }`}
                title={item.isSaved ? 'Saved in My Gallery' : 'Save to My Gallery (+10 pts)'}
              >
                <FolderHeart className={`w-3.5 h-3.5 ${item.isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              <button
                onClick={() => onBookmark?.(item)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  item.isBookmarked
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600'
                }`}
                title={item.isBookmarked ? 'Bookmarked' : 'Bookmark in Library'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <span>By</span>
              <strong className="text-slate-900 dark:text-white">{photographerName}</strong>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </span>
            {item.cohort && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                {item.cohort}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed font-medium">
            {item.description || 'Master-resolution licensed stock media on FingerMobile Protocol™.'}
          </p>
        </div>

        {/* Action Row & Monetization Engagement */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-1 text-xs">
            {/* Like / Upvote */}
            <button
              onClick={() => onLike?.(item.id)}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border font-bold ${
                item.hasLiked
                  ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-500/40'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:text-red-600'
              }`}
              title="Like / Vote (+5 Sovereign pts)"
            >
              <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? 'fill-red-600 text-red-600' : ''}`} />
              <span>{item.likes || 0}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => onAddComment?.(item.id)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:text-sky-600 transition flex items-center gap-1.5 font-bold"
              title="Community Discussion (+6 Sovereign pts)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
              <span>{item.comments || 0}</span>
            </button>

            {/* Share to FingerMobile & Social Media Networks */}
            <button
              onClick={() => onShare?.(item)}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/40 transition flex items-center gap-1.5 font-bold shadow-xs"
              title="Share to FingerMobile Platform & Social Networks (+8 Sovereign pts)"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Share</span>
              <span className="font-mono text-[11px]">({item.shares || 0})</span>
            </button>
          </div>

          {/* CTA Row */}
          <div className="flex items-center gap-2">
            {isVideo && onStreamVideo && (
              <button
                onClick={() => onStreamVideo(item)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5" />
                Stream 4K
              </button>
            )}

            <button
              onClick={() => onAcquireLicense?.(item)}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              License (80/20)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCreditCard;
