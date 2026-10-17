import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PolicyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType?: string;
  currentPolicy?: string;
  onSave?: (policy: string) => void;
}

const PolicyEditorModal: React.FC<PolicyEditorModalProps> = ({
  isOpen,
  onClose,
  policyType = 'Privacy Policy',
  currentPolicy = '',
  onSave
}) => {
  const [editedPolicy, setEditedPolicy] = React.useState(currentPolicy);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(editedPolicy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-300">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit {policyType}</h2>
            <p className="text-sm text-gray-500">Policy Editor</p>
          </div>
          <button onClick={onClose} className="text-slate-700 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <textarea
            value={editedPolicy}
            onChange={(e) => setEditedPolicy(e.target.value)}
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Enter or edit policy content here..."
          />
        </div>

        <div className="p-6 border-t border-slate-300 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyEditorModal;
