
import React, { useEffect, useRef, useState } from 'react';
interface PulsatingBalanceProps {
  balance: number;
  currency?: string;
  showAnimation?: boolean;
}

const PulsatingBalance: React.FC<PulsatingBalanceProps> = ({
  balance,
  currency = 'USD',
  showAnimation = true
}) => {
  const [pulse, setPulse] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(balance);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (balance !== previousBalance) {
      setPulse(true);
      const timerRefTemp = setTimeout(() => setPulse(false), 1000);
      
      // Store the timeout ID in the ref
      timerRef.current = timerRefTemp;
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [balance, previousBalance]);

  useEffect(() => {
    setPreviousBalance(balance);
  }, [balance]);

  // Determine CSS classes based on animation state
  const containerClasses = `flex items-center justify-center transition-all duration-1000 ${
    pulse && showAnimation ? 'scale-110 bg-yellow-200 p-4 rounded-lg' : ''
  }`;

  return (
    <div className={containerClasses}>
      <span className={`text-xl font-semibold ${pulse && showAnimation ? 'animate-pulse text-purple-600' : ''}`}>
        {currency} {balance.toLocaleString()}
      </span>
    </div>
  );
};

export default PulsatingBalance;