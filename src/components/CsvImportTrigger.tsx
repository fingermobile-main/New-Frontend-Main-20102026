import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/contexts/AppContext';

interface CsvImportTriggerProps {
  onImportComplete: () => void;
}

const CsvImportTrigger: React.FC<CsvImportTriggerProps> = ({ onImportComplete }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useAppContext(); // Using showToast instead of addNotification

  const handleImport = async () => {
    setLoading(true);
    try {
      // Simulate CSV import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call onImportComplete when finished
      onImportComplete();
      
      // Show success notification using showToast
      showToast('CSV import completed successfully!', 'success');
    } catch (error) {
      console.error('Error importing CSV:', error);
      // Show error notification
      showToast('Error importing CSV file', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-import-trigger">
      <Button onClick={handleImport} disabled={loading}>
        {loading ? 'Importing...' : 'Import CSV'}
      </Button>
    </div>
  );
};

export default CsvImportTrigger;