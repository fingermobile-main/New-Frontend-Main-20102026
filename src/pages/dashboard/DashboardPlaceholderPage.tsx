import { useLocation } from 'react-router-dom';
import React, {} from 'react';

import { ChartBarIcon } from '../../components/icons';

const DashboardPlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname
    .split('/')
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{pageName}</h1>
      <div className="bg-white p-12 rounded-xl shadow-md text-center">
        <div className="mx-auto mb-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center border text-blue-950 border-blue-400 font-black">
          <ChartBarIcon className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-xl font-bold mb-2">Content Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          This section of the dashboard is under construction. Check back later
          for full functionality for {pageName}.
        </p>
      </div>
    </div>
  );
};

export default DashboardPlaceholderPage;
