import React, { useState } from 'react';
interface FundTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  onTransfer?: (amount: number, recipient: string, note: string) => void;
}

const FundTransferModal: React.FC<FundTransferModalProps> = ({
  isOpen,
  onClose,
  currentBalance = 1000,
  onTransfer
}) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [transferType, setTransferType] = useState<'send' | 'request'>('send');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transferAmount = parseFloat(amount);
    
    if (!transferAmount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!recipient.trim()) {
      setError('Please enter a recipient');
      return;
    }
    
    if (transferType === 'send' && transferAmount > currentBalance) {
      setError('Insufficient balance');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onTransfer) {
        await onTransfer(transferAmount, recipient, note);
      }
      
      setSuccess(`Successfully ${transferType === 'send' ? 'sent' : 'requested'} ${formatCurrency(transferAmount)}`);
      
      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setRecipient('');
        setNote('');
        setSuccess(null);
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amt);
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              💸 {transferType === 'send' ? 'Send Money' : 'Request Money'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Transfer Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTransferType('send')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  transferType === 'send'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setTransferType('request')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  transferType === 'request'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Request
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Current Balance */}
            {transferType === 'send' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Available Balance: <span className="font-bold">{formatCurrency(currentBalance)}</span>
                </p>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
              </div>
              
              {/* Quick Amounts */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quickAmounts.map((quickAmt) => (
                  <button
                    key={quickAmt}
                    type="button"
                    onClick={() => setAmount(quickAmt.toString())}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    {formatCurrency(quickAmt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {transferType === 'send' ? 'Recipient' : 'From'} *
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={transferType === 'send' ? 'Username or email' : 'Username or email'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a message..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{note.length}/200 characters</p>
            </div>

            {/* Summary */}
            {amount && recipient && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Transfer Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(parseFloat(amount))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !amount || !recipient}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                transferType === 'send' ? 'Send Money' : 'Request Money'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FundTransferModal;