import React from 'react';

import { useAppContext } from "../contexts/AppContext";
import ImportedDataDemo from '../components/ImportedDataDemo';
import { Link } from 'react-router-dom';

const DataImportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Import</h1>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <ImportedDataDemo />
        </div>
      </main>
    </div>
  );
};

export default DataImportPage;
