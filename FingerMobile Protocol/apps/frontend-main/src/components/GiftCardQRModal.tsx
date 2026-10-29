import React, { useState } from 'react';
import QRCodeDisplay from './common/QRCodeDisplay';
interface GiftCardQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCardData?: {
    id: string;
    amount: number;
    code: string;
    recipientName: string;
    message?: string;
  };
}

const GiftCardQRModal: React.FC<GiftCardQRModalProps> = ({
  isOpen,
  onClose,
  giftCardData
}) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mockGiftCard = giftCardData || {
    id: 'gc_123456',
    amount: 50.00,
    code: 'GIFT-2026-XXXX-YYYY',
    recipientName: 'John Doe',
    message: 'Happy Birthday! Enjoy your gift!'
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(giftCardData?.code || mockGiftCard.code)}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mockGiftCard.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div aria-label="Close modal"
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🎁 Gift Card
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Gift Card Display */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🎁</span>
                <span className="text-sm opacity-80">Gift Card</span>
              </div>

              <div className="mb-4">
                <p className="text-sm opacity-80 mb-1">Amount</p>
                <p className="text-4xl font-bold">{formatCurrency(mockGiftCard.amount)}</p>
              </div>

              <div className="border-t border-white border-opacity-30 pt-4">
                <p className="text-sm opacity-80 mb-1">To</p>
                <p className="font-semibold text-lg">{mockGiftCard.recipientName}</p>
              </div>

              {mockGiftCard.message && (
                <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-sm italic">"{mockGiftCard.message}"</p>
                </div>
              )}
            </div>

            {/* QR Code Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Redeem Code</h3>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {showCode ? 'Hide' : 'Show'} Code
                </button>
              </div>

              {showCode ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <p className="text-center font-mono text-lg font-bold text-gray-900 break-all">
                    {mockGiftCard.code}
                  </p>
                  <button
                    onClick={handleCopyCode}
                    className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>📋</span>
                    Copy Code
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <QRCodeDisplay
                    data={giftCardData?.code || mockGiftCard.code}
                    size={200}
                    showActions={false}
                  />
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>ℹ️</span>
                How to Redeem
              </h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Scan the QR code or enter the code manually</li>
                <li>The amount will be added to your account balance</li>
                <li>Use your balance for purchases on the platform</li>
              </ol>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-300 px-6 py-4 flex gap-3">
            <button
              onClick={handleCopyCode}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                copied ? 'bg-emerald-600 font-bold' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {copied ? '✓ Code Copied!' : 'Copy Code'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardQRModal;
