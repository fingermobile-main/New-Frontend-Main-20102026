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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-md w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-300">
          <h2 className="text-xl font-black text-slate-900">Create Paylink</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              min="1"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white placeholder:text-slate-400 font-mono text-sm"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white text-sm"
            >
              <option value="FIC">FIC</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white placeholder:text-slate-400 text-sm"
              placeholder="What is this payment for?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Expiration (Days)</label>
            <select
              value={formData.expirationDays}
              onChange={(e) => setFormData({...formData, expirationDays: e.target.value})}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white text-sm"
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
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
