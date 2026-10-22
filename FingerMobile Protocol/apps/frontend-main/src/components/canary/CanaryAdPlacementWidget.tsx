import React, { useEffect, useState } from 'react';

export interface CanaryAdItem {
  id: string;
  headline: string;
  description: string;
  primary_text?: string;
  media_url: string;
  thumbnail_url?: string;
  destination_url: string;
  call_to_action: string;
  format: string;
  placement: string;
  aspect_ratio: string;
  company_name?: string;
  carousel_cards?: Array<{
    id: string;
    media_url: string;
    headline: string;
    description: string;
    destination_url: string;
  }>;
}

interface CanaryAdPlacementWidgetProps {
  placement: 'feed_video' | '360_video' | 'carousel_video' | 'instant_articles' | 'instream' | 'marketplace' | 'stories' | 'search_results';
  className?: string;
}

export const CanaryAdPlacementWidget: React.FC<CanaryAdPlacementWidgetProps> = ({ placement, className = '' }) => {
  const [ad, setAd] = useState<CanaryAdItem | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/canary/delivery/${placement}?limit=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.ads && data.ads.length > 0) {
            setAd(data.ads[0]);
            // Track impression
            fetch('/api/canary/track/impression', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creative_id: data.ads[0].id, placement, view_duration_seconds: 5 })
            }).catch(() => {});
          }
        }
      } catch (err) {
        // Silently catch fetch errors
      }
    };

    fetchAd();
  }, [placement]);

  const handleAdClick = () => {
    if (ad) {
      fetch('/api/canary/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creative_id: ad.id })
      }).catch(() => {});
    }
  };

  if (!ad) {
    return null;
  }

  // 1. Stories Video Ad Layout (with 14% / 250px safe-area compliance banner)
  if (placement === 'stories') {
    return (
      <div className={`relative w-full max-w-sm mx-auto aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/40 shadow-2xl flex flex-col justify-between p-4 ${className}`}>
        {/* Top 14% Safe Area Bar */}
        <div className="z-10 flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
              FM
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[140px]">{ad.company_name || 'Canary Stories'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Sponsored
          </span>
        </div>

        {/* Video / Creative Media */}
        <div className="absolute inset-0 z-0">
          {ad.media_url.endsWith('.mp4') || ad.media_url.endsWith('.mov') ? (
            <video src={ad.media_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={ad.media_url} alt={ad.headline} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Bottom 14% Safe Area & CTA */}
        <div className="z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-left">
          <h3 className="text-sm font-black text-white">{ad.headline}</h3>
          {ad.description && <p className="text-xs text-slate-300 mt-1 line-clamp-2">{ad.description}</p>}
          <a
            href={ad.destination_url}
            onClick={handleAdClick}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            <span>{ad.call_to_action || 'Learn More'}</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // 2. Carousel Video Ads Layout (2 to 10 cards)
  if (placement === 'carousel_video' || (ad.carousel_cards && ad.carousel_cards.length > 0)) {
    const cards = ad.carousel_cards && ad.carousel_cards.length > 0 ? ad.carousel_cards : [ad];
    const currentCard = cards[activeCardIndex] || cards[0];

    return (
      <div className={`w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl text-white ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-500 uppercase tracking-wider">Canary™ Carousel</span>
            <span className="text-xs text-slate-300 font-medium">• {ad.company_name}</span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium font-mono">
            {activeCardIndex + 1} / {cards.length} Cards
          </span>
        </div>

        {/* Card Viewport */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img src={currentCard.media_url} alt={currentCard.headline} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 text-left">
            <h4 className="text-sm font-extrabold text-white">{currentCard.headline}</h4>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{currentCard.description}</p>
          </div>
        </div>

        {/* Card navigation dots */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1.5">
            {cards.map((_, idx) => (
              <button aria-label="Action"
                key={idx}
                type="button"
                onClick={() => setActiveCardIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeCardIndex ? 'bg-amber-500 w-5' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          <a
            href={currentCard.destination_url || ad.destination_url}
            onClick={handleAdClick}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
          >
            {ad.call_to_action || 'Shop Now'} →
          </a>
        </div>
      </div>
    );
  }

  // 3. Default Native Feed / In-Stream / Instant Articles Ad Card
  return (
    <div className={`w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl text-white ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-black text-amber-400">
            AD
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200">{ad.company_name || 'FingerMobile Partner'}</span>
            <span className="text-[10px] text-slate-500 ml-2">Sponsored • {placement.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {ad.primary_text && (
        <p className="text-xs text-slate-300 mb-2.5 line-clamp-2">{ad.primary_text}</p>
      )}

      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3">
        {ad.media_url.endsWith('.mp4') || ad.media_url.endsWith('.mov') ? (
          <video src={ad.media_url} controls playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={ad.media_url} alt={ad.headline} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-extrabold text-white truncate">{ad.headline}</h4>
          {ad.description && <p className="text-xs text-slate-300 font-medium truncate">{ad.description}</p>}
        </div>

        <a
          href={ad.destination_url}
          onClick={handleAdClick}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{ad.call_to_action || 'Learn More'}</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CanaryAdPlacementWidget;
