import React, {} from 'react';

interface OperantVideoStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OperantVideoStreamModal: React.FC<OperantVideoStreamModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Video Stream</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <p>Video stream content would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default OperantVideoStreamModal;
