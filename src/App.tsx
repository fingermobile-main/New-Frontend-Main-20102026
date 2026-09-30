import React, { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GlobalProviders } from './contexts/GlobalProviders';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeManager from './utils/themeManager';
import { router } from './app/AppRoutes';
import { RouteLoadingSpinner } from './components/RouteLoadingSpinner';
import { pushNotificationService } from './services/PushNotificationService';
import { showNotification } from './utils/notificationToast';

const PushNotificationInitializer: React.FC = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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

          showNotification({
            title: notification?.title || 'New Notification',
            body: notification?.body || '',
            url: data?.url,
            type: 'info',
          });
        });

        sessionStorage.setItem('push_notifications_initialized', 'true');
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };

    timerRef.current = setTimeout(initPushNotifications, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    // Initialize theme manager
    ThemeManager.initialize();

    if (process.env.NODE_ENV !== 'development') {
      return undefined;
    }

    const timer = setTimeout(() => {
      const styleTags = document.querySelectorAll('style');
      console.log(`[CSS Diagnostic] Found ${styleTags.length} <style> tags`);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalProviders>
      <PushNotificationInitializer />
      <ErrorBoundary>
        <RouterProvider
          router={router}
          fallbackElement={<RouteLoadingSpinner />}
        />
      </ErrorBoundary>
    </GlobalProviders>
  );
};

export default App;
