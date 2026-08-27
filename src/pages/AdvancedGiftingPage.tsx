import React, {} from 'react';
import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import { GiftIcon } from '../icons';
import AdvancedGiftingEngine from '../components/gifting/AdvancedGiftingEngine';
import MainLayout from '../components/layout/MainLayout';

const AdvancedGiftingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Advanced Gifting Page</h1>
      <p>This is the advanced gifting page.</p>
    </div>
  );
};

export default AdvancedGiftingPage;
