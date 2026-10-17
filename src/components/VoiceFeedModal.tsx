import React, {} from 'react';

interface VoiceFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceFeedModal: React.FC<VoiceFeedModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Voice Feed</h2>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 min-h-[300px]">
          <p>Voice feed content would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceFeedModal;
