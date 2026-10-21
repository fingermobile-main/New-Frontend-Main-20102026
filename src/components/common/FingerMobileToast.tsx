import React, { useEffect, useState } from 'react';
import { emojiPackService } from '../../services/emojiPackService';
import { X, Sparkles } from 'lucide-react';

export interface FingerMobileToastProps {
  id?: string;
  message: string | React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'voiceline';
  duration?: number;
  onClose?: () => void;
}

export const FingerMobileToast: React.FC<FingerMobileToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const emoji = emojiPackService.getToastEmoji(type);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 250);
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 250);
    }
  };

  if (!isVisible) return null;

  const typeBorderColor = {
    success: 'border-emerald-400/80 shadow-emerald-500/10',
    error: 'border-rose-400/80 shadow-rose-500/10',
    warning: 'border-amber-400/80 shadow-amber-500/10',
    info: 'border-cyan-400/80 shadow-cyan-500/10',
    voiceline: 'border-emerald-500/80 shadow-emerald-500/20'
  }[type] || 'border-slate-300';

  const typeBadgeText = {
    success: 'SUCCESS',
    error: 'ALERT',
    warning: 'NOTICE',
    info: 'INFO',
    voiceline: 'VOICELINE'
  }[type] || 'NOTIFICATION';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex items-center gap-3.5 p-3.5 pr-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 ${typeBorderColor} shadow-xl max-w-md w-full transition-all duration-200 transform translate-y-0 opacity-100 hover:scale-[1.01]`}
      style={{
        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(16, 185, 129, 0.12)'
      }}
    >
      {/* Official 5D Mint Green Glass Emoji */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-tr from-[#defaf2] via-[#bbf2e3] to-[#e6fff8] p-0.5 border border-emerald-300/80 shadow-sm overflow-hidden flex items-center justify-center">
        <img
          src={emoji.imageUrl}
          alt={emoji.altText}
          className="w-full h-full object-cover rounded-[10px] transform hover:scale-105 transition-transform duration-300"
          loading="eager"
        />
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-950 border border-emerald-400">
            {typeBadgeText}
          </span>
          <span className="text-[10px] font-bold text-slate-700 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
            FingerMobile™
          </span>
        </div>
        <div className="text-xs font-bold text-slate-900 leading-snug break-words">
          {message}
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FingerMobileToast;
