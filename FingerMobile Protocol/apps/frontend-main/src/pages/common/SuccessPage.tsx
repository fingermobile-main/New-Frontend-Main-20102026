import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState<number>(3);

  // Determine user accountType and destination
  const { accountType, roleName, destination, destinationLabel, badgeColor, cesScore, features } = useMemo(() => {
    // 1. Check URL query params
    const queryRole = (searchParams.get('role') || '').toLowerCase();

    // 2. Check local storage user
    let storedRole = '';
    let storedAccountType = '';
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        storedRole = (u.role || '').toLowerCase();
        storedAccountType = (u.accountType || '').toLowerCase();
      }
    } catch {
      // Safe fallback
    }

    const effectiveType = queryRole || storedAccountType || (storedRole.includes('creator') ? 'creator' : storedRole.includes('business') ? 'business' : 'personal');

    if (effectiveType === 'creator') {
      return {
        accountType: 'creator',
        roleName: 'Sovereign Content Creator',
        destination: '/creatordashboard',
        destinationLabel: 'Creator Studio & Monetization Hub',
        badgeColor: 'bg-purple-100 text-purple-950 border-purple-400',
        cesScore: 150,
        features: [
          'Regional Quota Seat Reserved & Verified',
          'Decentralized P2P Media Distribution',
          'Sovereign UGC Monetization & Royalties',
          'Zero-Commission Creator Hub'
        ]
      };
    }

    if (effectiveType === 'business') {
      return {
        accountType: 'business',
        roleName: 'Verified Business Organization',
        destination: '/businessoffices',
        destinationLabel: 'Sovereign Business Suite & Offices',
        badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
        cesScore: 300,
        features: [
          'Sovereign Commerce Storefront & Escrow',
          'Multi-Currency Invoicing & Cost BOQ',
          'Protocol Advertising & Targeted Campaigns',
          'Enterprise Governance & Auditing Access'
        ]
      };
    }

    return {
      accountType: 'personal',
      roleName: 'Sovereign Citizen Member',
      destination: '/login',
      destinationLabel: 'Sign In / Log In',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-400',
      cesScore: 50,
      features: [
        'End-to-End Encrypted Communications',
        'Decentralized Peer-to-Peer Social Feed',
        'Sovereign Identity & Privacy Protection',
        'Community Governance & Discussion Spaces'
      ]
    };
  }, [searchParams]);

  useEffect(() => {
    // Ensure all onboarding flags are firmly persisted in client storage
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('hasCompletedOnboarding', 'true');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        u.onboardingComplete = true;
        u.onboarding_completed = true;
        u.accountType = accountType;
        if (accountType === 'creator') {
          u.role = 'Creator';
          u.assignedDashboards = ['/creatordashboard', '/ugc-dashboard', '/monetization-dashboard'];
        } else if (accountType === 'business') {
          u.role = 'Business';
          u.assignedDashboards = ['/businessoffices', '/monetization-dashboard', '/storefront'];
        } else {
          u.role = u.role || 'Member';
        }
        localStorage.setItem('user', JSON.stringify(u));
        if (u.id) {
          localStorage.setItem(`onboardingComplete_${u.id}`, 'true');
        }
      } catch (_e) {
        // Safe fallback
      }
    }

    // Countdown interval
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(destination);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, destination, accountType]);

  const handleManualProceed = () => {
    navigate(destination);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8 select-none">
      <div className="w-full max-w-xl bg-white border border-slate-300 rounded-2xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          FingerMobile Protocol
        </h1>

        {/* Onboarding Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-xs sm:text-sm mb-4 shadow-sm">
          <span>✓</span>
          <span>Onboarding Completed Successfully</span>
        </div>

        {/* Role Recognition Banner */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Assigned Sovereign Role:
            </span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
              {roleName}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 border-t border-slate-200 pt-2 mt-2">
            <span>Calibrated P2P Reputation Score:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {cesScore} CES
            </span>
          </div>
        </div>

        {/* Enabled Features List */}
        <div className="w-full bg-white border border-slate-200 rounded-xl p-4 mb-6 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Active Privileges & Microservices
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mr-2 text-[10px] font-bold">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Destination Information */}
        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-6 text-xs text-slate-800 font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Navigating to: <strong className="text-indigo-950 font-bold">{destinationLabel}</strong></span>
          </div>
          <span className="text-indigo-950 font-black bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
            {countdown}s
          </span>
        </div>

        {/* Immediate Access Button */}
        <button
          onClick={handleManualProceed}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <span>Proceed to Sign In Now</span>
          <span>&rarr;</span>
        </button>

        <p className="text-slate-700 font-medium text-xs mt-3">
          Auto-redirecting in {countdown} second{countdown === 1 ? '' : 's'}...
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
