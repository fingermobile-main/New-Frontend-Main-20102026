import React from 'react';
import { ImportedDataContext } from '../contexts/ImportedDataContext';

export const useImportedDataCtx = () => {
  const context = React.useContext(ImportedDataContext);
  if (context === undefined) {
    throw new Error(
      'useImportedDataCtx must be used within an ImportedDataProvider',
    );
  }

  return context;
};
