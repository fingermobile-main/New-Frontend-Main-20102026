import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  SparklesIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface OwnItAccessGuardProps {
  children: React.ReactNode;
}

export const OwnItAccessGuard: React.FC<OwnItAccessGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Evaluate RBAC & Badge Access Logic
  const role = (user?.role || '').toLowerCase();
  const hasBadges = Array.isArray(user?.badges) && user.badges.length > 0;
  const isVerifiedBadge = Boolean(user?.isVerified || hasBadges);

  // Check subscription tiers or elevated roles
  const isPrivilegedRole =
    role === 'admin' ||
    role === 'superadmin' ||
    role === 'moderator' ||
    role === 'premium' ||
    role === 'premier';

  // Check custom subscription field if present in user record
  const hasSubscriptionPlan = Boolean(
    (user as any)?.subscriptionTier === 'premium' ||
    (user as any)?.subscriptionTier === 'premier' ||
    (user as any)?.subscriptionTier === 'creator' ||
    (user as any)?.hasSubscription === true
  );

  const isEligible = Boolean(user && (isPrivilegedRole || isVerifiedBadge || hasSubscriptionPlan));

  // If eligible, render OwnIt page contents
  if (isEligible) {
    return <>{children}</>;
  }

  // Otherwise, render the Curated Prestige Membership Gate
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Crown / Sparkle Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <SparklesIcon className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Heading & Narrative */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase">
            <LockClosedIcon className="w-3.5 h-3.5" />
            Restricted Sovereign Access
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            OwnIt™ Premium Store
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            OwnIt™ is the exclusive prestige marketplace reserved for certified leaders, verified badge holders, and elite subscribers of the FingerMobile Protocol™.
          </p>
        </div>

        {/* Eligibility Criteria Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Badge Holders</h4>
              <p className="text-xs text-slate-400 mt-1">Verified community leaders, pioneers, and hallmark holders.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <SparklesIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Premium & Premier Members</h4>
              <p className="text-xs text-slate-400 mt-1">Subscribers with active high-tier sovereign privilege.</p>
            </div>
          </div>
        </div>

        {/* Financial Policy Note */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 mb-8 flex items-center gap-3">
          <span className="text-lg">⚖️</span>
          <div>
            <span className="font-bold text-amber-300">OwnIt Statutory Rule:</span> Platform earnings cannot be liquidated for OwnIt luxury acquisitions. Purchases are strictly conducted via Infinite Coin (FIC), Direct Gateway, or Promo Cards.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/subscriptions')}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            Upgrade to Premier / Subscription
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="py-3.5 px-6 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-sm transition border border-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnItAccessGuard;
