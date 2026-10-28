import { Link } from 'react-router-dom';
import React, {} from 'react';

import ImportedDataDemo from '../components/ImportedDataDemo';


const DataImportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      <header className="bg-white shadow">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 flex justify-between items-center">
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
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8">
          <ImportedDataDemo />
        </div>
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          to="/"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-lg transition-colors"
        >
          <span className="text-base mb-0.5">🏠</span>
          <span>Home</span>
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg transition-colors"
        >
          <span className="text-base mb-0.5">📊</span>
          <span>Import</span>
        </button>
        <Link
          to="/csv-import"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-lg transition-colors"
        >
          <span className="text-base mb-0.5">⚡</span>
          <span>Bulk CSV</span>
        </Link>
      </div>
    </div>
  );
};

export default DataImportPage;
