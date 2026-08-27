import React from 'react';

import { useAppContext } from "../contexts/AppContext";
import { useMonetization } from '../contexts/MonetizationContext';



// --- Main Container Page Component ---
const MonetizationDashboardPage: React.FC = () => {
  const { member } = useAppContext();
  const monetization = useMonetization();
  
  if (!member) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <h1 className="text-2xl font-bold">Monetization Dashboard</h1>
        <p>You need to be logged in to view monetization information.</p>
        <a 
          href="/login" 
          className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 shadow-sm mt-4"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <h1 className="text-2xl font-bold">Monetization Dashboard</h1>
        <p>This is the monetization dashboard page.</p>
      </div>
    </div>
  );
};

export default MonetizationDashboardPage;