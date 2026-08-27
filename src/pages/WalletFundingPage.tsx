import React, { useState } from 'react';

import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { GiftIcon, PaylinkIcon, CurrencyNairaIcon, CreditCardIcon, BankIcon, UserCircleIcon, ArrowRightIcon } from '../icons';

const WalletFundingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Wallet Funding</h1>
      <p>This is the wallet funding page.</p>
    </div>
  );
};

export default WalletFundingPage;
