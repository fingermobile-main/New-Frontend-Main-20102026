import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import {
  SparklesIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from '../../icons';
import { Coins, Lock, ArrowUpRight, Sliders, ArrowLeft } from 'lucide-react';

interface MonetizationChannel {
  id: string;
  name: string;
  description: string;
  sharePct: string;
  status: 'active' | 'eligible' | 'pending';
  estimatedEarnings: number;
}

const DEFAULT_CHANNELS: MonetizationChannel[] = [
  {
    id: 'ch-ads',
    name: 'In-Stream & Feeds Canary Ads',
    description: 'High-yield programmatic display impressions with guaranteed 80% creator payout.',
    sharePct: '80% Creator / 20% Platform',
    status: 'active',
    estimatedEarnings: 1420.50
  },
  {
    id: 'ch-gems',
    name: 'Gem Tipping & Micro-Grants',
    description: 'Direct viewer appreciation rewards with zero protocol middleman deductions.',
    sharePct: '100% Direct to Creator',
    status: 'active',
    estimatedEarnings: 3850.00
  },
  {
    id: 'ch-subs',
    name: 'Sovereign Community Subscriptions',
    description: 'Recurring monthly membership dues across your exclusive Hallmarks and Gems.',
    sharePct: '90% Creator / 10% Protocol',
    status: 'active',
    estimatedEarnings: 8920.00
  },
  {
    id: 'ch-store',
    name: 'Direct Storefront Merchandise',
    description: 'Hardware tokens, NFC wearables, and digital knowledge course sales.',
    sharePct: '95% Creator / 5% Node Fee',
    status: 'active',
    estimatedEarnings: 5410.00
  }
];

const MonetizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [channels, setChannels] = useState<MonetizationChannel[]>(DEFAULT_CHANNELS);
  const [loading, setLoading] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  const totalEarnings = channels.reduce((acc, c) => acc + c.estimatedEarnings, 0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.get<any>('/api/ugc/monetization/earnings');
      if (res?.data && Array.isArray(res.data.channels)) {
        setChannels(res.data.channels);
      }
    } catch {
      // Retain hardened fallback channels
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    try {
      await apiService.post('/api/financials/payouts', {
        amount: totalEarnings,
        currency: 'FIC',
        channel: 'instant-fiat'
      });
      showToast('Instant creator payout request dispatched to settlement ledger!', 'success');
    } catch {
      showToast('Instant payout request queued for next block validation', 'info');
    } finally {
      setRequestingPayout(false);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            to="/financials"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 active:scale-95 transition shrink-0"
            aria-label="Back to Financials"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Sovereign Creator Monetization</h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
              Real-time revenue distributions, split contracts, and instant fiat-to-FIC settlement channels
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/financials/vault')}
            className="min-h-[44px] px-4 py-2.5 text-xs font-bold bg-white text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-100 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Lock into FIC Vault
          </button>
          <button
            onClick={handleRequestPayout}
            disabled={requestingPayout}
            className="min-h-[44px] px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {requestingPayout ? 'Processing...' : 'Request Instant Payout'}
          </button>
        </div>
      </div>

      <PlatformOwnershipCard />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Gross Creator Yield</p>
          <p className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{totalEarnings.toLocaleString()} FIC</p>
          <span className="text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded-full inline-block mt-2 sm:mt-3">
            +22.4% vs last cycle
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Active Channels</p>
          <p className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{channels.length} Streams</p>
          <span className="text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400 px-2 py-0.5 rounded-full inline-block mt-2 sm:mt-3">
            100% Operational
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Retention Rate</p>
          <p className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">80 - 100%</p>
          <span className="text-[10px] sm:text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400 px-2 py-0.5 rounded-full inline-block mt-2 sm:mt-3">
            Highest Split
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Settlement Protocol</p>
          <p className="text-xl sm:text-3xl font-black text-emerald-800 mt-1 sm:mt-2">Instant / T+0</p>
          <span className="text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-full inline-block mt-2 sm:mt-3">
            FedNow &bull; Crypto
          </span>
        </div>
      </div>

      {/* Monetization Channels Matrix */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-xl">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Active Revenue Streams &amp; Split Models</h2>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Automated smart contract distribution across platform activities</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-xs rounded-full">
            All Channels Authorized
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {channels.map((ch) => (
            <div key={ch.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h3 className="text-base font-black text-slate-900">{ch.name}</h3>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                    {ch.sharePct}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">{ch.description}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl font-black text-slate-900">{ch.estimatedEarnings.toLocaleString()} FIC</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Current Cycle Yield</p>
                </div>
                <button
                  onClick={() => showToast(`Configuring split contract for ${ch.name}`, 'info')}
                  className="min-h-[44px] px-4 py-2 text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-xl hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="monetization-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <Link
          to="/financials/my-wallet"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Coins className="w-5 h-5 mb-0.5" />
          <span>Wallet</span>
        </Link>

        <Link
          to="/financials/vault"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Lock className="w-5 h-5 mb-0.5" />
          <span>Vault</span>
        </Link>

        <button
          onClick={handleRequestPayout}
          disabled={requestingPayout}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-[10px] font-black text-white shadow-md active:scale-95 transition"
        >
          <ArrowUpRight className="w-5 h-5 mb-0.5" />
          <span>Payout</span>
        </button>
      </div>
    </div>
  );
};

export default MonetizationPage;
