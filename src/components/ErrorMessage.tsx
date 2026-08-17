import React, {} from 'react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  [key: string]: any;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className }) => {
  return (
    <div className={className || "bg-red-50 border border-red-200 rounded-lg p-6 text-center"}>
      <h3 className="text-red-800 font-semibold mb-2">Error</h3>
      <p className="text-red-600 mb-4">{message || "An error occurred"}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
