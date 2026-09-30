import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const AnalyticsOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the consolidated advanced analytics page
    navigate('/advanced-analytics', { replace: true });
  }, [navigate]);

  return (
    <MainLayout pageTitle="Analytics Redirecting...">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Redirecting to Advanced Analytics...
        </p>
      </div>
    </MainLayout>
  );
};

export default AnalyticsOverviewPage;
