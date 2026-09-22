import React from 'react';
import { useBusinessSuiteStore } from './business-suite-store';

const AffiliatePage: React.FC = () => {
  const { overview, loading, error } = useBusinessSuiteStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Affiliate Program</h1>
      
      {overview?.affiliate ? (
        <div>
          <h2 className="text-xl mb-2">Affiliate Metrics</h2>
          <p>Total Referrals: {overview.affiliate.length}</p>
          {/* Add more affiliate metrics as needed */}
        </div>
      ) : (
        <p>No affiliate data available.</p>
      )}
    </div>
  );
};

export default AffiliatePage;