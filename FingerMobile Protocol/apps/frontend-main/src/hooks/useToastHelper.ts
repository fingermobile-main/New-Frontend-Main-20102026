import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';

/**
 * A custom hook that provides helper functions for showing toast notifications
 * This hook demonstrates the standardized way to integrate toast notifications in other hooks
 */
export const useToastHelper = () => {
  const { showSuccessToast, showErrorToast, showInfoToast, showWarningToast, showToast } = useAppContext();

  /**
   * Shows an async operation toast that automatically handles success/error states
   */
  const executeAsyncOperation = React.useCallback(
    async (operation: () => Promise<void>,
      successMessage: string, errorMessage = 'An error occurred during the operation.'
    ) => {
      try {
        await operation();
        showSuccessToast(successMessage);
      } catch (error) {
        console.error(error);
        showErrorToast(`${errorMessage} ${(error as Error)?.message || ''}`);
      }
    },
    [showSuccessToast, showErrorToast]
  );

  /**
   * Shows a temporary message that disappears after a delay
   */
  const showTemporaryMessage = React.useCallback(
    (message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
      showToast(message, type);
      // Note: Currently, the AppContext hardcodes the duration to 5000ms
      // This is just for documentation purposes
    },
    [showToast]
  );

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    showToast,
    executeAsyncOperation,
    showTemporaryMessage
  };
};
