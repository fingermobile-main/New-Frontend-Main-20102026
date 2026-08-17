import React, { useState, useContext } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { toast } from 'react-toastify';
import { Web3Context } from '../contexts/Web3Context';

interface SendFicModalProps {
  onClose: () => void;
  onSend: (recipient: string, amount: string, message: string) => Promise<void>;
}

const SendFicModal: React.FC<SendFicModalProps> = ({ onClose, onSend }) => {
  const web3Context = useContext(Web3Context);
  const { ficBalance, showToast } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  // Check if context exists
  if (!web3Context) {
    return null;
  }

  const balance = web3Context?.balance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipient) {
      setError('Recipient is required');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(amount) > balance) {
      setError('Insufficient balance');
      return;
    }

    setIsSending(true);

    try {
      await onSend(recipient, amount, message);
      onClose();
      showToast('FIC sent successfully!', 'success');
    } catch (err) {
      setError('Failed to send FIC. Please try again.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Send FIC</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter wallet address or username"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="any"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-500">FIC</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Available: {balance} FIC</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add a message..."
                rows={3}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send FIC'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendFicModal;