import React, { useState } from 'react';

interface RequestTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

const RequestTitleModal: React.FC<RequestTitleModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [title, setTitle] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(title);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request Title</h2>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-semibold"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestTitleModal;
