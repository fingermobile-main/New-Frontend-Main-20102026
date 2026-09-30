import React from 'react';

// Simple toast implementation to satisfy imports
// This can be expanded to integrate with a real toast library like sonner or a custom provider

import { toast as toastifyToast } from 'react-toastify';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const useToast = () => {
  const toast = React.useCallback(({ title, description, variant }: ToastProps) => {
    const message = description ? `${title}: ${description}` : (title || '');
    if (variant === 'destructive') {
      toastifyToast.error(message);
    } else if (variant === 'success') {
      toastifyToast.success(message);
    } else if (variant === 'warning') {
      toastifyToast.warning(message);
    } else {
      toastifyToast.info(message);
    }
  }, []);

  return { toast };
};
