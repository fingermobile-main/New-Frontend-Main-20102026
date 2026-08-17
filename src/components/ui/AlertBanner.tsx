import React, { useState } from 'react';
interface AlertBannerProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  closable?: boolean;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type = 'info', message, closable = true }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const bannerClass = `alert-banner ${type}`;

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className={bannerClass}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        {closable && (
          <button className="alert-close" onClick={handleClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;