import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import CsvImportComponent from '../components/CsvImportComponent';
import CsvImportTrigger from '../components/CsvImportTrigger';

const CsvImportPage: React.FC = () => {
  const handleImportComplete = () => {
    console.info('Import completed');
    // Handle imported data as needed
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
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
      </div>
    </MainLayout>
  );
};

export default CsvImportPage;