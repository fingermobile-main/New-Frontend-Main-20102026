import React, { useEffect } from 'react';
import pushNotificationService from '../services/PushNotificationService';

const PushNotificationInitializer: React.FC = () => {
  useEffect(() => {
    // Only attempt to initialize if push notifications / service workers are supported in browser
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      if (Notification.permission === 'granted') {
        pushNotificationService.requestPermission().catch((err: unknown) => {
          // Non-blocking log if FCM credentials or service worker aren't active in dev
          console.debug('[PushNotificationInitializer] Background sync notice:', err);
        });
      }
    }
  }, []);

  return null;
};

export default PushNotificationInitializer;
