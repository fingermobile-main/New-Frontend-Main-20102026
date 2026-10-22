import { Outlet, useLocation} from 'react-router-dom';
import React, {} from 'react';

import { useAppContext } from '../../contexts/AppContext';

import * as ReactRouterDOM from 'react-router-dom';
import { FinancialsIcon, WalletIcon, CreditCardIcon, VaultIcon, SubscriptionIcon, EarningsIcon, ReferralIcon, LoyaltyIcon, GiftCardIcon } from '../../icons';
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
    <div className="min-h-full space-y-6">
      <div className="border-b border-slate-300 bg-white sticky top-0 z-10 shadow-xs">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex items-center gap-4">
            <FinancialsIcon className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-black text-slate-900">Financial Ecosystem & Liquidity Matrix</h1>
              <p className="text-slate-700 font-medium">Manage your sovereign FIC wallet, vault lockups, subscriptions, and institutional monetization.</p>
            </div>
          </div>

          {/* Sovereign Platform Ownership Proof */}
          <PlatformOwnershipCard />
        </div>
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {navLinks.map(link => (
              <ReactRouterDOM.NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `flex items-center gap-2 py-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </ReactRouterDOM.NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default FinancialsPage;
