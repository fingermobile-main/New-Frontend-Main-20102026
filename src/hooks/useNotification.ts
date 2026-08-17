import React from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';

export const useNotification = () => {
  const context = useNotificationContext();
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
};
