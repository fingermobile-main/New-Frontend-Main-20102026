import React, { useState } from 'react';

import MainLayout from '../components/layout/MainLayout';
import {
  GiftIcon,
  PaylinkIcon,
  CurrencyNairaIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon
} from '../icons';
import PageHeader from '../components/PageHeader';
import { useAppContext } from "../contexts/AppContext";

const WalletAndPayPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Wallet & Pay</h1>
      <p>This is the wallet and pay page.</p>
    </div>
  );
};

export default WalletAndPayPage;
