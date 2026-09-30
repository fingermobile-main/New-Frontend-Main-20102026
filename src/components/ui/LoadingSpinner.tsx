import React, {} from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', centered = false }) => {
  const spinnerSize = size === 'small' ? '20px' : size === 'large' ? '40px' : '30px';

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid rgba(0, 0, 0, 0.1)',
    borderTop: '3px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyle = centered
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }
    : {};

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
