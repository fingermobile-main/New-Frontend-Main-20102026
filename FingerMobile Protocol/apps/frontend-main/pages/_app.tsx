import '../src/index.css';
import type { AppProps } from 'next/app';
import { GlobalProviders } from '../src/contexts/GlobalProviders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeManager from '../src/utils/themeManager';
import { pushNotificationService } from '../src/services/PushNotificationService';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize theme manager
    ThemeManager.initialize();

    // Initialize push notifications
    const initPushNotifications = async () => {
      try {
        const token =
          localStorage.getItem('fingermobile_token') || localStorage.getItem('token');

        if (!token) {
          console.info('Skipping push notification init because no auth token is present');
          return;
        }

        if (sessionStorage.getItem('push_notifications_initialized') === 'true') {
          return;
        }

        const fcmToken = await pushNotificationService.requestPermission();

        if (!fcmToken) {
          console.info('Push notification permission was not granted');
          return;
        }

        pushNotificationService.onMessageReceived((payload: Record<string, unknown>) => {
          const notification = payload.notification as
            | { title?: string; body?: string }
            | undefined;
          const data = payload.data as { url?: string } | undefined;

          // Show notification - you may need to implement this function
          // showNotification({
          //   title: notification?.title || 'New Notification',
          //   body: notification?.body || '',
          //   url: data?.url,
          //   type: 'info',
          // });
        });

        sessionStorage.setItem('push_notifications_initialized', 'true');
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };

    // Delay initialization slightly
    const timer = setTimeout(initPushNotifications, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalProviders>
      <Component {...pageProps} />
      <ToastContainer />
    </GlobalProviders>
  );
}