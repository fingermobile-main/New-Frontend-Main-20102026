import React, { useEffect, useRef, useState } from 'react';
interface PulsatingBalanceProps {
  balance: number;
  currency?: string;
  onChange?: (newBalance: number) => void;
  showAnimation?: boolean;
}

const PulsatingBalance: React.FC<PulsatingBalanceProps> = ({
  balance,
  currency = 'USD',
  onChange,
  showAnimation = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(balance);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (balance !== previousBalance) {
      setIsAnimating(true);
      setPreviousBalance(balance);

      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [balance, previousBalance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getBalanceColor = () => {
    if (balance > 1000) return 'text-green-600';
    if (balance > 500) return 'text-blue-600';
    if (balance > 100) return 'text-purple-600';
    return 'text-orange-600';
  };

  const getBackgroundColor = () => {
    if (balance > 1000) return 'from-green-50 to-emerald-50 border-green-200';
    if (balance > 500) return 'from-blue-50 to-cyan-50 border-blue-200';
    if (balance > 100) return 'from-purple-50 to-pink-50 border-purple-200';
    return 'from-orange-50 to-yellow-50 border-orange-200';
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundColor()} border-2 rounded-lg p-4 transition-all`}>
      <div className="flex items-center justify-between">
        {/* Balance Display */}
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${isAnimating && showAnimation ? 'animate-pulse' : ''}`}>
            💰
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Current Balance</p>
            <p className={`text-3xl font-bold ${getBalanceColor()} transition-all ${
              isAnimating && showAnimation ? 'scale-110' : ''
            }`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-end gap-1">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            balance > 1000 ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
              balance > 500 ? 'bg-blue-100 text-green-950 border border-green-400 font-bold' :
                balance > 100 ? 'bg-purple-100 text-green-950 border border-green-400 font-bold' :
                  'bg-orange-100 text-green-950'
          }font-black`}>
            {balance > 1000 ? 'Excellent' :
              balance > 500 ? 'Good' :
                balance > 100 ? 'Fair' : 'Low'}
          </span>

          {isAnimating && showAnimation && (
            <span className="text-xs text-gray-500 animate-pulse">Updated</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onChange && onChange(balance + 100)}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          + Add Funds
        </button>

        <button
          onClick={() => onChange && onChange(Math.max(0, balance - 50))}
          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Withdraw
        </button>

        <button className="px-3 py-2 bg-blue-100 text-blue-950 border border-blue-400 font-bold rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
          📊 History
        </button>
      </div>

      {/* Balance Trend */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <span className="text-green-600">↑ 12%</span>
        <span>from last month</span>
      </div>
    </div>
  );
};

export default PulsatingBalance;
