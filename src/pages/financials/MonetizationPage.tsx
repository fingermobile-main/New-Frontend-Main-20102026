import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';

const MonetizationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MonetizationPage</h1>
          <p className="text-gray-500 mt-2">This module is currently under development.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </header>

      <main className="flex-1 bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Future FingerMobile Functionality</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This area will be connected to the backend database tables shortly.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow" onClick={() => apiService.post('/api/monetizationpage/save', { /* data */ })}>
              Save Settings
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50" onClick={() => apiService.post('/api/monetizationpage/upload', { /* formData */ })}>
              Upload Media
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonetizationPage;
