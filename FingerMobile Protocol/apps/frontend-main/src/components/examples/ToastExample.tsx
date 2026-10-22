import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';  // Using absolute path from src


/**
 * A practical example component demonstrating how to use the standardized toast system
 */
const ToastExample: React.FC = () => {
  const {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    showToast
  } = useAppContext();

  const handleSuccessClick = () => {
    showSuccessToast('Operation completed successfully!');
  };

  const handleErrorClick = () => {
    showErrorToast('An error occurred during the operation.');
  };

  const handleInfoClick = () => {
    showInfoToast('Please check your email for verification.');
  };

  const handleWarningClick = () => {
    showWarningToast('This action cannot be undone.');
  };

  const handleCustomClick = () => {
    showToast('This is a custom toast message', 'info');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Toast Notification Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleSuccessClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Show Success Toast
        </button>

        <button
          onClick={handleErrorClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Show Error Toast
        </button>

        <button
          onClick={handleInfoClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Show Info Toast
        </button>

        <button
          onClick={handleWarningClick}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Show Warning Toast
        </button>

        <button
          onClick={handleCustomClick}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors col-span-2"
        >
          Show Custom Toast
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">How to use toasts in your components:</h3>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`
const MyComponent = () => {
  const { showSuccessToast, showErrorToast } = useAppContext();
  
  const handleSubmit = async () => {
    try {
      // Perform async operation
      await submitData();
      
      // Show success notification
      showSuccessToast("Data submitted successfully!");
    } catch (error) {
      // Show error notification
      showErrorToast("Failed to submit data. Please try again.");
    }
  };
  
  return (
    <button type="button" onClick={handleSubmit}>Submit</button>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default ToastExample;
