/**
 * Badge Sovereign Enclave Page
 * Route: /enclave/badge-privileges
 * Dedicated enclave for Badge Holders to redeem fee discounts, unlock private vaults, and access VIP drops
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Crown,
  Sparkles,
  ShieldCheck,
  Percent,
  Lock,
  Unlock,
  ChevronRight,
  Gift,
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import sovereignRbacApi, { BadgeTierPrivilege } from '../../services/sovereignRbacApi';
import { useAuth } from '../../contexts/AuthContext';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const BadgePrivilegesEnclavePage: React.FC = () => {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<BadgeTierPrivilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTier, setActiveTier] = useState<string>('badge_tier_gold');

  useEffect(() => {
    document.title = 'Badge Sovereign Enclave | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getBadgeTiers();
      setTiers(data);
      if (data.length > 0) {
        setActiveTier(data[2]?.id || data[0].id);
      }
    } catch (err) {
      console.error('Failed to load badge tiers:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedTier = tiers.find(t => t.id === activeTier) || tiers[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-orange-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Badge Sovereign Enclave
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400 text-[11px] font-black">
            Tier-Based Protocol Perks Active
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-sm">
              <Crown className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Badge Sovereign Enclave & Privilege Vault
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Dynamic fee discounts, private vault keys, priority algorithm curation, and exclusive LushPin drop reservations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/gems"
              className="px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Gift className="w-3.5 h-3.5" />
              Upgrade Badge Tier
            </Link>
          </div>
        </div>

        {/* Tier Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tiers.map((t) => {
            const isSelected = t.id === activeTier;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative shadow-sm ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                    Level {t.badge_level}
                  </span>
                  <Award className="w-4 h-4" style={{ color: t.badge_color }} />
                </div>
                <h3 className="text-sm font-black text-slate-900 truncate">{t.tier_name}</h3>
                <div className="mt-2 text-lg font-black text-slate-900 flex items-center gap-1">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  {t.fee_discount_pct}% Fee Off
                </div>
                <div className="mt-2 text-[11px] font-bold text-slate-700">
                  Min: <span className="text-slate-900 font-extrabold">{t.min_fic_balance.toLocaleString()} FIC</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Tier Spotlight */}
        {selectedTier && (
          <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-xl bg-slate-100 text-slate-900 border border-slate-300">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{selectedTier.tier_name}</h2>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                      Active In Enclave
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">
                    Requires {selectedTier.min_fic_balance.toLocaleString()} FIC balance and minimum {selectedTier.min_reputation} reputation rating.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700">Marketplace Fee Discount</div>
                  <div className="text-2xl font-black text-emerald-700">-{selectedTier.fee_discount_pct}%</div>
                </div>
              </div>
            </div>

            {/* Perks Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  {selectedTier.can_access_private_vaults ? (
                    <Unlock className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                  Private Vault Access
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {selectedTier.can_access_private_vaults
                    ? 'Granted: You can unlock sovereign encrypted folders and private creator archives.'
                    : 'Locked: Requires Gold tier or higher.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  {selectedTier.can_access_early_drops ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                  VIP Drop Access
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {selectedTier.can_access_early_drops
                    ? 'Granted: 48-hour early reservation window on limited physical and digital pressies.'
                    : 'Locked: Available for Silver tiers and above.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  {selectedTier.priority_curation ? (
                    <Star className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                  Algorithmic Curation Boost
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {selectedTier.priority_curation
                    ? 'Granted: 2.5x feed visibility boost across Forum, Beatwave, and Storefront.'
                    : 'Locked: Reserved for Gold, Platinum, and Sovereign VIP.'}
                </p>
              </div>
            </div>

            {/* Included Perks List */}
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                Included Member Perks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {(Array.isArray(selectedTier.perks) ? selectedTier.perks : []).map((perk, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-300 flex items-center gap-2 text-xs font-bold text-slate-900 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <a
          href="/enclave/badge-privileges"
          aria-label="Badge Enclave"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-amber-600"
        >
          <span className="text-base">🛡️</span>
          <span>Enclave</span>
        </a>
        <button
          onClick={() => { const input = document.querySelector('input') as HTMLInputElement; if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth' }); } }}
          aria-label="Search Badges"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-amber-600"
        >
          <span className="text-base">🔍</span>
          <span>Search</span>
        </button>
        <button
          onClick={() => window.location.reload()}
          aria-label="Reload Badges"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-amber-600"
        >
          <span className="text-base">🔄</span>
          <span>Sync</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-amber-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default BadgePrivilegesEnclavePage;
