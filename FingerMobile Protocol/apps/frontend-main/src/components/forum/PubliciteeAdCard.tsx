import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Eye,
  MousePointerClick,
  Share2
} from 'lucide-react';

interface PubliciteeAdCardProps {
  className?: string;
  onAdClick?: () => void;
}

export const PubliciteeAdCard: React.FC<PubliciteeAdCardProps> = ({
  className = '',
  onAdClick
}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(384);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCtaClick = () => {
    if (onAdClick) onAdClick();
    navigate('/publicitee');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/publicitee`;
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
        await navigator.share({ title: 'Publicitee Sovereign Ads & Reels', url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Aborted or fallback
    }
  };

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 shadow-sm p-4 hover:shadow-md transition-all ${className}`}
    >
      {/* Top Protocol Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Megaphone className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Publicitee®©℠ Sovereign Ads
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-100 text-amber-950 border border-amber-400">
                <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                Sponsored
              </span>
            </div>
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">
              Verified Canary Ads Display Network • P2P Relayed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400 font-bold">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>EAL6+ Verified</span>
        </div>
      </div>

      {/* Main Ad Banner & Creative */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 mb-3 group">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000"
          alt="Publicitee Sovereign Campaign"
          className="w-full h-44 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3.5">
          <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mb-1">
            Featured Programmatic Campaign
          </span>
          <h4 className="text-base sm:text-lg font-black text-white leading-tight">
            Launch Your Brand Across FingerMobile™ Canary Ads Network
          </h4>
          <p className="text-xs text-slate-200 mt-1 line-clamp-2">
            Target high-intent sovereign users across Search, Display, In-Stream Video, and Discover feeds with 100% tokenized analytics.
          </p>
        </div>
      </div>

      {/* Action Strip & Metrics */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-slate-900 dark:text-white">24.5k</strong> views
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-slate-900 dark:text-white">4.8%</strong> CTR
          </span>
          <button
            type="button"
            onClick={() => {
              setLikes((l) => (hasLiked ? l - 1 : l + 1));
              setHasLiked(!hasLiked);
            }}
            className={`flex items-center gap-1 font-bold ${hasLiked ? 'text-rose-600' : 'text-slate-700 hover:text-slate-900'}`}
          >
            <span>❤️</span> {likes}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/canaryads')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
          >
            <span>Canary Ads</span>
          </button>
          <button
            type="button"
            onClick={handleCtaClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-slate-950 text-xs font-black shadow-xs transition"
          >
            <span>Explore Publicitee</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PubliciteeAdCard;
