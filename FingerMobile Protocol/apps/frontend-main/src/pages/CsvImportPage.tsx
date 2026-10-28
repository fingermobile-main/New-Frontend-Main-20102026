import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';
import CsvImportComponent from '../components/CsvImportComponent';
import CsvImportTrigger from '../components/CsvImportTrigger';

const CsvImportPage: React.FC = () => {
  const handleImportComplete = () => {
    // eslint-disable-next-line no-console
    console.info('Import completed');
    // Handle imported data as needed
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <h1 className="text-3xl font-bold mb-6">CSV Data Import</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Direct File Upload</h2>
          <CsvImportComponent onImportComplete={handleImportComplete} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Bulk Import from Server</h2>
          <p className="text-gray-600 mb-4">
            Use this section to import data directly from the server CSV files.
            This will process all CSV files in the designated directory and import
            them into the appropriate database tables.
          </p>
          <CsvImportTrigger onImportComplete={handleImportComplete} />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">📂</span>
            <span>Upload</span>
          </button>
          <button
            onClick={() => {
              const el = document.querySelector('button');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">⚡</span>
            <span>Bulk Server</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">⬆️</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CsvImportPage;
