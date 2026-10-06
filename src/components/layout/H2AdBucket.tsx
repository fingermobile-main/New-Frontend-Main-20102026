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

interface LiveVaultData {
  ficBalance: number;
  walletBalance: number;
  pendingEarnings: number;
}

export const H2AdBucket: React.FC = () => {
  const [ad, setAd] = useState<CanaryAdItem | null>(null);
  const [maskBalance, setMaskBalance] = useState(false);
  const [isPulsating, setIsPulsating] = useState(true);
  const [vault, setVault] = useState<LiveVaultData>({
    ficBalance: 1450.50,
    walletBalance: 320.00,
    pendingEarnings: 82.20,
  });

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
      } catch {
        // Fallback to default platform house ad
      }
    };

    const fetchVault = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setVault(prev => ({
              ficBalance: data.data.fic_balance ?? prev.ficBalance,
              walletBalance: data.data.wallet_balance ?? prev.walletBalance,
              pendingEarnings: data.data.pending_earnings ?? prev.pendingEarnings,
            }));
          }
        }
      } catch {
        // Keep fallback values
      }
    };

    fetchH2Ad();
    fetchVault();

    // Pulse interval for live vault indicator dot
    const pulseInterval = setInterval(() => {
      setIsPulsating((prev) => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const masked = '••••••';

  return (
    <section className="relative w-full bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-amber-500/20 text-white overflow-hidden shadow-2xl min-h-[168px] flex items-center">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-4 w-full">

        {/* H2 THREE-COLUMN HIGH-IMPACT BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

          {/* COLUMN 1 (7 Cols): Curated Canary Internal Ad Placement Container */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm shadow-inner">
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

          {/* COLUMN 2 (3 Cols): HD Media Auto Ads / AdSense & AdMob Programmatic Feed Container */}
          <div className="lg:col-span-3 flex flex-col justify-center rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/20 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <span>HD Programmatic</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px]">Auto-Ad</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
                💎
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">AdSense / AdMob Verified</p>
                <p className="text-[11px] text-slate-400">Algorithmic placement tailored to member interests.</p>
              </div>
            </div>
            <div className="mt-3 text-right">
              <Link to="/canary/ad-maker" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                Place Your Ad Here →
              </Link>
            </div>
          </div>

          {/* COLUMN 3 (2 Cols): Live Vault — Member Wallet & Earnings Card with 3 stacked rows */}
          <div className="lg:col-span-2 flex flex-col rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 overflow-hidden shadow-lg backdrop-blur-md">

            {/* Card Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/60 flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 transition-all duration-700 ${isPulsating ? 'opacity-100 scale-110' : 'opacity-50 scale-90'}`} />
                Live Vault
              </span>
              <button
                type="button"
                onClick={() => setMaskBalance(!maskBalance)}
                className="p-0.5 text-slate-400 hover:text-amber-400 transition-colors"
                title={maskBalance ? 'Show balances' : 'Hide balances'}
              >
                {maskBalance ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeOffIcon className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Row 1: FIC Token Balance */}
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-sm leading-none">🪙</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">FIC<br/>Tokens</span>
              </div>
              <span className="text-xs font-extrabold text-amber-300 tabular-nums text-right">
                {maskBalance ? masked : vault.ficBalance.toLocaleString()}
              </span>
            </div>

            {/* Row 2: Live Wallet $ Balance */}
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 text-sm leading-none">💳</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">Live<br/>Wallet</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-300 tabular-nums text-right">
                {maskBalance ? masked : `$${vault.walletBalance.toFixed(2)}`}
              </span>
            </div>

            {/* Row 3: Pending Earnings */}
            <div className="flex items-center justify-between px-3.5 py-3 hover:bg-slate-800/30 transition-colors flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-sm leading-none">📈</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">Pending<br/>Earn</span>
              </div>
              <span className="text-xs font-extrabold text-indigo-300 tabular-nums text-right">
                {maskBalance ? masked : `${vault.pendingEarnings.toFixed(2)}`}
                {!maskBalance && <span className="text-[9px] text-slate-500 block text-right">FIC</span>}
              </span>
            </div>

            {/* Card Footer — quick wallet link */}
            <Link
              to="/wallet"
              className="block text-center text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-amber-400 transition-colors py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex-shrink-0"
            >
              Manage Wallet →
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default H2AdBucket;
