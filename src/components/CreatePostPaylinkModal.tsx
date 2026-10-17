import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreatePostPaylinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (paylinkData: any) => void;
  postId?: string;
}

const CreatePostPaylinkModal: React.FC<CreatePostPaylinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  postId
}) => {
  const [formData, setFormData] = React.useState({
    amount: '',
    currency: 'FIC',
    description: '',
    expirationDays: '7'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, postId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-300">
          <h2 className="text-xl font-bold text-gray-900">Create Paylink</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-700 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white"
            >
              <option value="FIC">FIC</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              placeholder="What is this payment for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration (Days)</label>
            <select
              value={formData.expirationDays}
              onChange={(e) => setFormData({...formData, expirationDays: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white"
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Paylink
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPaylinkModal;
