import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '../icons';

interface CanaryAdItem {
  id: string;
  headline: string;
  description: string;
  media_url: string;
  destination_url: string;
  call_to_action: string;
  company_name?: string;
}

export const H2AdBucket: React.FC = () => {
  const [ad, setAd] = useState<CanaryAdItem | null>(null);
  const [maskBalance, setMaskBalance] = useState(false);
  const [isPulsating, setIsPulsating] = useState(true);

  const ficBalance = 1450.50;
  const walletBalance = 320.00;

  useEffect(() => {
    const fetchH2Ad = async () => {
      try {
        const res = await fetch('/api/canary/delivery/h2_banner?limit=1');
        if (res.ok) {
          const data = await res.json();
          if (data.ads && data.ads.length > 0) {
            setAd(data.ads[0]);
          }
        }
      } catch (err) {
        // Fallback to default platform house ad
      }
    };

    fetchH2Ad();

    // Pulse interval for wallet balance badge
    const pulseInterval = setInterval(() => {
      setIsPulsating((prev) => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-amber-500/20 text-white overflow-hidden shadow-2xl min-h-[168px] flex items-center">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-3 w-full">
        {/* Top Right Pulsating FIC & Live Wallet Balance with Mask Button */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-lg text-xs backdrop-blur-md">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isPulsating ? 'scale-125 opacity-100' : 'scale-90 opacity-70'} transition-transform duration-700`} />
              Live Vault
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-extrabold text-amber-400">
              🪙 {maskBalance ? '••••' : `${ficBalance.toLocaleString()} FIC`}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-extrabold text-emerald-400">
              💳 {maskBalance ? '••••' : `$${walletBalance.toFixed(2)}`}
            </span>
            <button
              type="button"
              onClick={() => setMaskBalance(!maskBalance)}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title={maskBalance ? 'Unmask financial balances' : 'Mask financial balances'}
            >
              {maskBalance ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeOffIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* H2 TWO-COLUMN HIGH-IMPACT BAR (3X LARGER THAN H1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

          {/* COLUMN 1 (8 Cols): Curated Canary Internal Ad Placement Container */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm shadow-inner">
            <div className="relative w-full sm:w-44 h-28 sm:h-28 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-amber-500/30">
              {ad?.media_url ? (
                <img src={ad.media_url} alt={ad.headline} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-amber-600/30 to-indigo-600/30 p-2 text-center">
                  <span className="text-2xl">📢</span>
                  <span className="text-[10px] font-bold text-amber-400 mt-1">Canary™ Internal Ads</span>
                </div>
              )}
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-slate-950/80 text-amber-400 border border-amber-500/40">
                Canary Sponsor
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[11px] font-bold text-slate-400">
                  {ad?.company_name || 'FingerMobile Verified Merchant'}
                </span>
                <span className="text-amber-500 text-[10px]">✓</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug line-clamp-1">
                {ad?.headline || 'Promote Your Brand Across the FingerMobile Network'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xl">
                {ad?.description || 'Place native in-feed, in-stream, and 360 ads. Non-refundable payments in FIC or Fiat with full AI community guidelines check.'}
              </p>
              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-3">
                <a
                  href={ad?.destination_url || '/canary/ad-maker'}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md transition-all"
                >
                  {ad?.call_to_action || 'Launch Campaign'}
                </a>
                <Link
                  to="/canary/ad-maker"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2"
                >
                  Ad Specs & Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* COLUMN 2 (4 Cols): HD Media Auto Ads / AdSense & AdMob Programmatic Feed Container */}
          <div className="lg:col-span-4 h-full flex flex-col justify-center rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/20 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <span>HD Media Programmatic</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px]">Auto-Ad Feeds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
                💎
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">AdSense / AdMob Verified</p>
                <p className="text-[11px] text-slate-400">High-converting algorithmic placement tailored to member interests.</p>
              </div>
            </div>
            <div className="mt-2 text-right">
              <Link to="/canary/ad-maker" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                Place Your Ad Here →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default H2AdBucket;
