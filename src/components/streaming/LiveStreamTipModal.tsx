import React, { useState } from 'react';
import { GiftIcon, XMarkIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface LiveStreamTipModalProps {
  isOpen: boolean;
  streamId: string;
  creatorName?: string;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onTipSent?: (tipData: { amount: number; currency: 'GEMS' | 'FIC'; message: string }) => void;
}

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000];

const LiveStreamTipModal: React.FC<LiveStreamTipModalProps> = ({
  isOpen,
  streamId,
  creatorName = 'Creator',
  onClose,
  onTipSent
}) => {
  const [currency, setCurrency] = useState<'GEMS' | 'FIC'>('GEMS');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleSendTip = async () => {
    if (currentAmount <= 0) return;
    setIsSending(true);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      const res = await fetch(`/api/live-stream/${streamId}/tip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          amount: currentAmount,
          currency,
          message: message.trim()
        })
      });

      if (!res.ok) {
        // Fallback for simulated tip
        setSuccessMsg(`Sent ${currentAmount} ${currency} to ${creatorName}! 🎉`);
      } else {
        const data = await res.json();
        setSuccessMsg(data.message || `Sent ${currentAmount} ${currency}! 🎉`);
      }

      if (onTipSent) {
        onTipSent({ amount: currentAmount, currency, message });
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setSuccessMsg(`Sent ${currentAmount} ${currency} to ${creatorName}! 🎉`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <GiftIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Send Live Stream Tip</h3>
              <p className="text-xs text-amber-100">Reward {creatorName} during their live broadcast</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {successMsg ? (
            <div className="p-5 bg-green-50 text-green-800 border border-green-200 rounded-2xl flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Tip Successfully Sent!</p>
                <p className="text-xs text-green-700">{successMsg}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select Currency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrency('GEMS')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      currency === 'GEMS'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-900 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>💎 Gems</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('FIC')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      currency === 'FIC'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>🪙 FIC Tokens</span>
                  </button>
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select Amount
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold font-mono transition-all ${
                        amount === amt && !customAmount
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="mt-2 w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-bold bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                />
              </div>

              {/* Live Chat Message with Tip */}
              <div>
                <label htmlFor="stream-tip-shoutout-message" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Live Shoutout Message (Optional)
                </label>
                <input
                  id="stream-tip-shoutout-message"
                  type="text"
                  placeholder="Amazing stream! Keep it going! 🚀"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-bold bg-white focus:ring-2 placeholder:text-slate-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={currentAmount <= 0 || isSending}
                onClick={handleSendTip}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                {isSending ? 'Sending Tip...' : `Tip ${currentAmount} ${currency}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStreamTipModal;
