import React from 'react';
/* eslint-disable no-console */
import { toast, type ToastIcon, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface NotificationData {
  title: string;
  body: string;
  icon?: ToastIcon | React.ReactNode;
  url?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Show a push notification as a toast
 */
export const showNotification = (data: NotificationData): void => {
  const { title, body, icon, url, type = 'info' } = data;

  const notificationContent = (
    <div 
      onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && url) {
          e.preventDefault();
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }}
      role={url ? 'button' : undefined}
      tabIndex={url ? 0 : undefined}
      className={url ? 'cursor-pointer hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded' : ''}
      style={{ cursor: url ? 'pointer' : 'default' }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '14px' }}>{body}</div>
    </div>
  );

  const toastOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: icon as any // Cast safely so React.ReactNode templates are accepted seamlessly by React-Toastify
  };

  switch (type) {
    case 'success':
      toast.success(notificationContent, toastOptions);
      break;
    case 'warning':
      toast.warning(notificationContent, toastOptions);
      break;
    case 'error':
      toast.error(notificationContent, toastOptions);
      break;
    default:
      toast.info(notificationContent, toastOptions);
  }
};

// Make it available globally for service worker integration
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).showNotification = showNotification;
}