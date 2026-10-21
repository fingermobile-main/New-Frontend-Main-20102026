import React from 'react';
import { HapticFeedbackContext } from '../contexts/HapticFeedbackContext';

export const useHaptic = () => {
  const context = React.useContext(HapticFeedbackContext);
  if (context === undefined) {
    throw new Error('useHaptic must be used within a HapticFeedbackProvider');
  }

  return context;
};
