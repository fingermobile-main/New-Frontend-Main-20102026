import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';

const JobsPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Jobs">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Jobs</h1>
        <p className="text-gray-600">Find job opportunities and career growth.</p>
        <div className="mt-8 space-y-4">
          {/* Job listings will be added here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Job Title</h3>
            <p className="text-gray-600 mt-2">Company • Location</p>
            <p className="text-sm text-gray-500 mt-1">Posted recently</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
