import { Outlet, useLocation} from 'react-router-dom';
import React, {} from 'react';

import { useAppContext } from '../../contexts/AppContext';

import * as ReactRouterDOM from 'react-router-dom';
import { FinancialsIcon, WalletIcon, CreditCardIcon, BanknotesIcon, GiftIcon, StarIcon, LockClosedIcon, VaultIcon, SubscriptionIcon, EarningsIcon, ReferralIcon, LoyaltyIcon, GiftCardIcon } from '../../icons';


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
    { name: 'Gift Cards', path: '/financials/giftcards', icon: <GiftCardIcon /> }
  ];

  const activeLinkClass = 'border-brand-blue text-brand-blue';
  const inactiveLinkClass = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <div className="min-h-full">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="p-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <FinancialsIcon className="w-10 h-10 text-brand-blue" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
              <p className="text-gray-600">Manage your FIC wallet, subscriptions, and monetization.</p>
            </div>
          </div>
        </div>
        <div className="px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {navLinks.map(link => (
              <ReactRouterDOM.NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm whitespace-nowrap ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </ReactRouterDOM.NavLink>
            ))}
          </nav>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default FinancialsPage;
