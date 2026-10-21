import React, { useState, useEffect } from 'react';

interface CognitiveBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptMessage?: string;
}

export const CognitiveBreakModal: React.FC<CognitiveBreakModalProps> = ({
  isOpen,
  onClose,
  promptMessage = 'You have been consuming content rapidly. Take a 60-second breathing moment to recharge.'
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(60);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center text-white space-y-6">
        {/* Soft Ambient Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/40 flex items-center justify-center text-3xl animate-pulse">
          🧘
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">Mindful Breathing Break</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {promptMessage}
          </p>
        </div>

        {/* Breathing Circular Gauge / Countdown */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div
            className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"
            style={{ animationDuration: '4s' }}
          />
          <div className="text-2xl font-black font-mono text-amber-400">
            {secondsRemaining}s
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-xs font-black transition-all ${
              secondsRemaining === 0
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-lg'
                : 'bg-slate-800 text-slate-300 font-semibold hover:text-white'
            }`}
          >
            {secondsRemaining === 0 ? 'Resume Browsing →' : 'Dismiss Mindful Moment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CognitiveBreakModal;
