import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payoutData: any) => void;
  availableBalance?: number;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableBalance = 0
}) => {
  const [amount, setAmount] = React.useState('');
  const [bankAccount, setBankAccount] = React.useState('');
  const [notes, setNotes] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ amount: Number(amount), bankAccount, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Payout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Available Balance</p>
            <p className="text-2xl font-bold text-blue-900">{availableBalance.toLocaleString()} FIC</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payout Amount (FIC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="100"
              max={availableBalance}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum: 100 FIC</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select bank account</option>
              <option value="account1">****1234 - First Bank</option>
              <option value="account2">****5678 - GTBank</option>
              <option value="account3">****9012 - Access Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes..."
            />
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
              Request Payout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPayoutModal;
