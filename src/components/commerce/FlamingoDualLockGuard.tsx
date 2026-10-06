import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FlamingoDualLockGuardProps {
  children: React.ReactNode;
}

export const FlamingoDualLockGuard: React.FC<FlamingoDualLockGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [birthDateInput, setBirthDateInput] = useState<string>('');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);

  // Check persisted age verification
  useEffect(() => {
    const verified = localStorage.getItem('flamingo_age_verified') === 'true';
    if (verified) {
      setIsAgeVerified(true);
    }
  }, []);

  // 1. Evaluate Privilege Tier (Lock 1: Role & Subscription Guard)
  const role = (user?.role || '').toLowerCase();
  const hasBadges = Array.isArray(user?.badges) && (user?.badges?.length || 0) > 0;
  const isVerifiedBadge = Boolean(user?.isVerified || hasBadges);

  const isPrivilegedRole =
    role === 'admin' ||
    role === 'superadmin' ||
    role === 'moderator' ||
    role === 'premium' ||
    role === 'premier';

  const hasSubscriptionPlan = Boolean(
    (user as any)?.subscriptionTier === 'premium' ||
    (user as any)?.subscriptionTier === 'premier' ||
    (user as any)?.subscriptionTier === 'creator' ||
    (user as any)?.hasSubscription === true
  );

  const isTierEligible = Boolean(user && (isPrivilegedRole || isVerifiedBadge || hasSubscriptionPlan));

  // Handle Age Verification Submission (Lock 2: Statutory 19+ Gate)
  const handleVerifyAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDateInput) {
      addToast('Please enter your date of birth.', 'warning');
      return;
    }
    if (!agreedTerms) {
      addToast('You must confirm compliance with platform policies.', 'warning');
      return;
    }

    const birth = new Date(birthDateInput);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age >= 19) {
      localStorage.setItem('flamingo_age_verified', 'true');
      setIsAgeVerified(true);
      addToast('Statutory 19+ Age Verification certified.', 'success');
    } else {
      addToast('Regulatory Lockout: Access denied for individuals below 19 under NDPA 2023.', 'error');
    }
  };

  // If Lock 1 Fails: Render Role / Subscription Gate
  if (!isTierEligible) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gradient-to-b from-slate-900 to-slate-950 border border-pink-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-pink-400/10 border border-pink-400/40 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-3xl">🦩</span>
            </div>
          </div>

          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold tracking-widest uppercase">
              <LockClosedIcon className="w-3.5 h-3.5" />
              Protected Route: Privilege Tier Required
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Flamingo™ Adult Wellness
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
              Flamingo™ is a private adult wellness store accessible exclusively to Admins, Badge Holders, Moderators, and Premium/Premier Subscribers of the FingerMobile Protocol™.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Badge & Moderator Access</h4>
                <p className="text-xs text-slate-400 mt-1">Verified community leadership or hallmark credentials.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Premium & Premier Members</h4>
                <p className="text-xs text-slate-400 mt-1">Active subscription holders enjoy seamless private entry.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 text-xs text-pink-200/90 mb-8 flex items-center gap-3">
            <span className="text-lg">💳</span>
            <div>
              <span className="font-bold text-pink-300">Earnings Benefit:</span> Once verified, members can shop directly using their Platform Earnings balance, Infinite Coin (FIC), gift cards, or promos.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/subscriptions')}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-sm transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
            >
              Upgrade / Subscribe to Enter
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
  }

  // If Lock 2 Fails: Render Statutory 19+ Age Verification Gate
  if (!isAgeVerified) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-pink-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-3xl">
              🦩
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Statutory Age Verification</h2>
            <p className="text-xs text-slate-400 mt-1">
              NDPA 2023 & Cybercrimes Act Compliance • Mandatory 19+ Gate
            </p>
          </div>

          <form onSubmit={handleVerifyAge} className="space-y-4">
            <div>
              <label htmlFor="dob-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob-input"
                required
                value={birthDateInput}
                onChange={(e) => setBirthDateInput(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-pink-500"
                />
                <span>
                  I legally certify that I am at least 19 years old and consent to viewing adult wellness products under strict platform compliance.
                </span>
              </label>
              <div className="flex items-center gap-1.5 text-pink-300/80 pt-1 border-t border-slate-800/80">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Blind & Discreet Plain-Box Packaging Guaranteed</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-pink-600/20"
            >
              Verify Age & Enter Flamingo
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dual-Lock Authenticated: Render Page Contents
  return <>{children}</>;
};

export default FlamingoDualLockGuard;
