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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-md w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-300">
          <h2 className="text-xl font-black text-slate-900">Request Payout</h2>
          <button aria-label="Close" type="button" onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-xs font-black uppercase tracking-wider text-blue-950">Available Balance</p>
            <p className="text-2xl font-black text-blue-950 mt-0.5">{availableBalance.toLocaleString()} FIC</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Payout Amount (FIC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="100"
              max={availableBalance}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white placeholder:text-slate-400 font-mono text-sm"
              placeholder="Enter amount"
            />
            <p className="text-xs text-slate-700 font-medium mt-1">Minimum: 100 FIC</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Bank Account</label>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white text-sm"
            >
              <option value="">Select bank account</option>
              <option value="account1">****1234 - First Bank</option>
              <option value="account2">****5678 - GTBank</option>
              <option value="account3">****9012 - Access Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold bg-white placeholder:text-slate-400 text-sm"
              placeholder="Add any additional notes..."
            />
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
              Request Payout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPayoutModal;
