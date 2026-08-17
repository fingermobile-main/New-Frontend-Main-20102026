import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';

const CommunitiesPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Communities">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Communities</h1>
        <p className="text-gray-600">Discover and join communities that match your interests.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Community cards will be added here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Community 1</h3>
            <p className="text-gray-600 mt-2">Description coming soon...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunitiesPage;
