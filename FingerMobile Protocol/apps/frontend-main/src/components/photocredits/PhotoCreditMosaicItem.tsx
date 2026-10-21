/*
 * FingerMobile Protocol™ - PhotoCreditMosaicItem Component
 * Mosaic/Masonry tile with high-impact visuals, hover overlays, and instant actions
 * Adheres to Workspace High-Contrast Rules (text-slate-900, text-slate-800, border-slate-300)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React from 'react';
import {
  Heart,
  Share2,
  FolderHeart,
  Bookmark,
  Star,
  Film,
  MapPin,
  Cpu,
  Play,
  Download
} from 'lucide-react';
import type { PhotoCreditItem } from '../../pages/PhotoCreditsPage';

/* eslint-disable no-unused-vars */
interface PhotoCreditMosaicItemProps {
  item: PhotoCreditItem;
  isSaved?: boolean;
  isBookmarked?: boolean;
  isFavorite?: boolean;
  onLike?: (id: string) => void;
  onShare?: (item: PhotoCreditItem) => void;
  onSave?: (item: PhotoCreditItem) => void;
  onBookmark?: (item: PhotoCreditItem) => void;
  onToggleFavorite?: (item: PhotoCreditItem) => void;
  onInspectAi?: (item: PhotoCreditItem) => void;
  onPlayVideo?: (item: PhotoCreditItem) => void;
  onSelect?: (item: PhotoCreditItem) => void;
  onOpenFullscreen?: (item: PhotoCreditItem) => void;
  onLicense?: (item: PhotoCreditItem) => void;
}
/* eslint-enable no-unused-vars */

export const PhotoCreditMosaicItem: React.FC<PhotoCreditMosaicItemProps> = ({
  item,
  isSaved = false,
  isBookmarked = false,
  isFavorite = false,
  onLike,
  onShare,
  onSave,
  onBookmark,
  onToggleFavorite,
  onInspectAi,
  onPlayVideo,
  onSelect,
  onOpenFullscreen,
  onLicense
}) => {
  const isVideo = item.media_type === 'video' || Boolean(item.videoUrl);
  const aiScore = item.aiScore ?? Math.min(99, Math.round(((item.rating || 4.9) / 5) * 100));

  const handleClick = () => {
    if (onOpenFullscreen) {
      onOpenFullscreen(item);
    } else if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer break-inside-avoid mb-4"
    >
      {/* Media Image */}
      <img
        src={item.thumbnailUrl || item.imageUrl}
        alt={item.title}
        loading="lazy"
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
        {isVideo && (
          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
            <Film className="w-2.5 h-2.5" /> 4K
          </span>
        )}
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
          {item.category}
        </span>
      </div>

      {/* Top Right Quick Favorite & AI Score */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspectAi?.(item);
          }}
          className="p-1 px-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[10px] font-bold flex items-center gap-0.5 hover:text-white"
          title="Inspect Autonomous AI Score"
        >
          <Cpu className="w-3 h-3 text-amber-400" />
          <span>{aiScore}%</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item);
          }}
          className={`p-1 rounded-lg backdrop-blur-md border transition ${
            isFavorite
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-950/80 text-slate-200 border-slate-700 hover:text-amber-400'
          }`}
          title={isFavorite ? 'In Favorites' : 'Add to Favorites'}
        >
          <Star className={`w-3 h-3 ${isFavorite ? 'fill-slate-950' : ''}`} />
        </button>
      </div>

      {/* Video Play Overlay */}
      {isVideo && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlayVideo?.(item);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition z-10"
        >
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl border-2 border-white/80 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>
      )}

      {/* Hover Information Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-end z-20">
        <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
        <div className="text-[11px] text-slate-200 flex items-center justify-between mt-1">
          <span className="truncate">By <strong className="text-white">{item.photographer}</strong></span>
          <span className="font-bold text-amber-300 shrink-0">🪙 {item.price_credits} FIC</span>
        </div>

        {typeof item.location === 'string' && item.location.trim().length > 0 && (
          <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-amber-400" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {/* Hover Quick Action Icons */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(item.id);
              }}
              className={`p-1.5 rounded-lg border text-xs transition ${
                item.hasLiked
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:text-red-400'
              }`}
              title="Like / Vote"
            >
              <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(item);
              }}
              className={`p-1.5 rounded-lg border text-xs transition ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:text-rose-400'
              }`}
              title={isSaved ? 'Saved in My Gallery' : 'Save to My Gallery'}
            >
              <FolderHeart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(item);
              }}
              className={`p-1.5 rounded-lg border text-xs transition ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:text-amber-400'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLicense?.(item);
              }}
              className="px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition transform hover:scale-105"
              title="Acquire License (80% Creator Royalty)"
            >
              <Download className="w-3 h-3" />
              <span>License</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(item);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
              title="Share to FingerMobile Platform & Social Networks"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCreditMosaicItem;
