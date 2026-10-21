import React from 'react';
import { FingerMobileToast } from './common/FingerMobileToast';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 1200,
  onClose
}) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] pointer-events-auto">
      <FingerMobileToast
        message={message}
        type={type}
        duration={duration}
        onClose={onClose}
      />
    </div>
  );
};

export default ToastNotification;
