import React, {} from 'react';
/*
 * FingerMobile Protocol™ - Gift Modal Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */


interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: () => Promise<void>;
  giftAmount: string;
  setGiftAmount: (amount: string) => void;
  ficBalance: number;
  isProcessing: boolean;
}

const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  onSendGift,
  giftAmount,
  setGiftAmount,
  ficBalance,
  isProcessing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Send Gift</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="giftAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Gift Amount (FIC)
            </label>
            <input
              id="giftAmount"
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="text-sm text-gray-600">
            Your Balance: <span className="font-semibold">{ficBalance} FIC</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={onSendGift}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isProcessing || !giftAmount || parseFloat(giftAmount) <= 0 || parseFloat(giftAmount) > ficBalance}
            >
              {isProcessing ? 'Processing...' : 'Send Gift'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;
