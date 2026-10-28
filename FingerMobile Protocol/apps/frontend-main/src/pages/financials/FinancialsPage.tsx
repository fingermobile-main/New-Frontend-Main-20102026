import { Outlet, useLocation, Link, NavLink } from 'react-router-dom';
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { FinancialsIcon, WalletIcon, CreditCardIcon, VaultIcon, SubscriptionIcon, EarningsIcon, ReferralIcon, LoyaltyIcon, GiftCardIcon } from '../../icons';
import { Wallet, Lock, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const FinancialsPage = () => {
  const { showToast } = useAppContext();
  useLocation();

  const navLinks = [
    { name: 'Wallet', path: '/financials/wallet', icon: <WalletIcon /> },
    { name: 'FIC Vault', path: '/financials/vault', icon: <VaultIcon /> },
    { name: 'Subscriptions', path: '/financials/subscriptions', icon: <SubscriptionIcon /> },
    { name: 'Monetization', path: '/financials/monetization', icon: <EarningsIcon /> },
    { name: 'Referrals', path: '/financials/referrals', icon: <ReferralIcon /> },
    { name: 'Loyalty', path: '/financials/loyalty', icon: <LoyaltyIcon /> },
    { name: 'Gift Cards', path: '/financials/giftcards', icon: <GiftCardIcon /> },
    { name: 'LoanSqr Micro-Finance', path: '/loansqr', icon: <CreditCardIcon /> }
  ];

  const activeLinkClass = 'border-blue-600 text-blue-900 font-black';
  const inactiveLinkClass = 'border-transparent text-slate-700 hover:text-slate-900 font-bold hover:border-slate-300';

  return (
    <div className="min-h-full space-y-6 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="border-b border-slate-300 bg-white sticky top-0 z-10 shadow-xs">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-slate-800 active:scale-95 transition shrink-0"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FinancialsIcon className="w-10 h-10 text-blue-600 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Financial Ecosystem &amp; Liquidity Matrix</h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">Manage your sovereign FIC wallet, vault lockups, subscriptions, and institutional monetization.</p>
            </div>
          </div>

          {/* Sovereign Platform Ownership Proof */}
          <PlatformOwnershipCard />
        </div>
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none py-1">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `min-h-[44px] flex items-center gap-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8">
        <Outlet />
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="financials-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <Link
          to="/financials/my-wallet"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span>Wallet</span>
        </Link>

        <Link
          to="/financials/fic-vault"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Lock className="w-5 h-5 mb-0.5" />
          <span>Vault</span>
        </Link>

        <Link
          to="/financials/monetization"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Monetize</span>
        </Link>

        <Link
          to="/financials/subscriptions"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-[10px] font-black text-white shadow-md active:scale-95 transition"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Plans</span>
        </Link>
      </div>
    </div>
  );
};

export default FinancialsPage;
