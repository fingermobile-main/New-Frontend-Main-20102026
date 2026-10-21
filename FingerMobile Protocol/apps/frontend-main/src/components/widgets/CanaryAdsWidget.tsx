import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Play,
  Pause,
  Eye,
  MousePointerClick,
  Pin,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import widgetService, { WidgetEntity } from '../../services/widgetService';

interface CanaryAdsWidgetProps {
  customWidget?: WidgetEntity;
  onAdClick?: () => void;
}

export const CanaryAdsWidget: React.FC<CanaryAdsWidgetProps> = ({ customWidget, onAdClick }) => {
  const navigate = useNavigate();
  const [widget, setWidget] = useState<WidgetEntity>(() => customWidget || widgetService.getPermanentCanaryWidget());
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    if (customWidget) {
      setWidget(customWidget);
    } else {
      const unsub = widgetService.subscribe(() => {
        setWidget(widgetService.getPermanentCanaryWidget());
      });
      return unsub;
    }
  }, [customWidget]);

  useEffect(() => {
    if (!hasTrackedImpression && widget.id) {
      widgetService.recordImpression(widget.id);
      setHasTrackedImpression(true);
    }
  }, [widget.id, hasTrackedImpression]);

  const handleCtaClick = () => {
    widgetService.recordClick(widget.id);
    if (onAdClick) onAdClick();
    if (widget.actionUrl.startsWith('http')) {
      window.open(widget.actionUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(widget.actionUrl);
    }
  };

  const handleSecondaryClick = () => {
    widgetService.recordClick(widget.id);
    const targetUrl = widget.secondaryActionUrl || '/canary-admaker';
    navigate(targetUrl);
  };

  return (
    <div
      id="canary-ads-permanent-widget"
      className="relative rounded-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/40 border-2 border-amber-400/90 shadow-md p-4 transition-all hover:shadow-lg overflow-hidden group"
    >
      {/* Permanent Anchor Banner Seal */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400">
            <Pin className="w-3 h-3 text-amber-700" />
            Permanent Sponsor Rail
          </span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
            Verified
          </span>
        </div>

        <span className="text-[10px] font-mono font-bold text-amber-800">
          CANARY ADS™
        </span>
      </div>

      {/* Header Info */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-xs shrink-0">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight">
            {widget.title}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {widget.subtitle || 'Verified High-Impact Decentralized Ad'}
          </p>
        </div>
      </div>

      {/* Rich Media Canvas: Video or Image */}
      <div className="relative rounded-xl overflow-hidden mb-3 border border-amber-300 bg-slate-900 aspect-video group/media">
        {isPlayingVideo && widget.primaryVideoUrl ? (
          <div className="relative w-full h-full">
            <video
              src={widget.primaryVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsPlayingVideo(false)}
                className="p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900"
                title="Pause Video"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={
                widget.primaryImageUrl ||
                'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
              }
              alt={widget.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Video Play Trigger if video asset exists */}
            {widget.primaryVideoUrl && (
              <button
                type="button"
                onClick={() => setIsPlayingVideo(true)}
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-500/90 text-white flex items-center justify-center hover:bg-amber-600 transition shadow-lg group-hover/media:scale-110"
                title="Play Canary Video Clip"
              >
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </button>
            )}

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px]">
              <span className="font-bold flex items-center gap-1 drop-shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Featured Advertiser
              </span>
              <span className="bg-slate-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">
                4K Stream Ready
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed mb-3">
        {widget.description}
      </p>

      {/* Real-time Attribution Telemetry */}
      <div className="grid grid-cols-2 gap-2 p-2 mb-3 rounded-xl bg-amber-100/70 border border-amber-300 text-[10px]">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-amber-800" />
          <div>
            <span className="block text-[9px] uppercase font-bold text-amber-900">Impressions</span>
            <span className="font-mono font-bold text-slate-900">
              {widget.impressions.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-amber-800" />
          <div>
            <span className="block text-[9px] uppercase font-bold text-amber-900">Clicks (CTR)</span>
            <span className="font-mono font-bold text-slate-900">
              {widget.clicks.toLocaleString()} ({((widget.clicks / Math.max(1, widget.impressions)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={handleCtaClick}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
        >
          <span>{widget.ctaText || 'Launch Canary Ad'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleSecondaryClick}
          className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-amber-100/50 text-slate-800 font-bold text-[11px] border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <TrendingUp className="w-3 h-3 text-amber-700" />
          <span>{widget.secondaryCtaText || 'Open AdMaker Visual Studio'}</span>
        </button>
      </div>
    </div>
  );
};

export default CanaryAdsWidget;
