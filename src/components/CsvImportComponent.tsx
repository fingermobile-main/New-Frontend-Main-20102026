import React, { useState } from 'react';
import type { ParseResult } from 'papaparse';
import Papa from 'papaparse';

interface CsvImportProps {
  onImportComplete: (data: unknown[]) => void;
}

const CsvImportComponent: React.FC<CsvImportProps> = ({ onImportComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<any>) => {
        onImportComplete(results.data);
        setLoading(false);
      },
      error: (error: Error) => {
        setError(error.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="csv-import-component">
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        disabled={loading}
      />
      
      {loading && <div>Processing...</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
};

export default CsvImportComponent;