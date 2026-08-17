import React, {} from 'react';

interface AnalyticsDashboardProps {
  stats?: any;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats }) => {
  return (
    <div>
      <h2>AnalyticsDashboard</h2>
      <p>Stats: {JSON.stringify(stats)}</p>
    </div>
  );
};

export default AnalyticsDashboard;
