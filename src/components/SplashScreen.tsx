import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  isLoading?: boolean;
  message?: string;
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isLoading = true,
  message = 'Initializing FingerMobile Protocol...',
  onFinish,
  minDurationMs = 4000,
}) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setFading(true);
        const fadeTimer = setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 500);
        return () => clearTimeout(fadeTimer);
      }, minDurationMs);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDurationMs, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 250, 0.92) 50%, rgba(235, 240, 248, 0.88) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
      role="alert"
      aria-busy="true"
      aria-label="Loading FingerMobile Protocol"
    >
      {/* Background Decorative Crystal Glass Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-200/40 via-blue-200/30 to-purple-200/20 blur-3xl pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-indigo-100/50 via-white/80 to-amber-100/40 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Glassmorphic Crystal Card Container */}
      <div
        className="relative flex flex-col items-center p-8 sm:p-12 rounded-3xl max-w-sm w-full mx-4 border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(255,255,255,0.9)_inset] transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Crystal Shimmer Border Highlight */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/80" />

        {/* Logo Container with Smooth Floating / Breathing Effect */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-xl scale-125 animate-pulse" />
          <img
            src="/assets/branding/fingermobile/FRONT copy.webp"
            alt="FingerMobile Protocol"
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_10px_20px_rgba(255,107,0,0.2)] animate-bounce duration-1000"
            style={{ animationDuration: '3s' }}
            onError={(e) => {
              // Fallback to logo.png or alternative alias if webp fails
              const target = e.currentTarget;
              if (target.src.indexOf('FRONT%20copy.webp') !== -1 || target.src.indexOf('FRONT copy.webp') !== -1) {
                target.src = '/assets/branding/fingermobile/drawer-splash-logo.webp';
              } else {
                target.src = '/assets/branding/fingermobile/logo.png';
              }
            }}
          />
        </div>

        {/* Brand Title */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 mb-1 text-center font-sans">
          FingerMobile<span className="text-orange-500">™</span>
        </h1>
        <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-6 text-center">
          Next-Gen Protocol Communication
        </p>

        {/* Crystal Progress Loading Bar */}
        <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden relative shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 rounded-full animate-[progress_1.8s_ease-in-out_infinite]"
            style={{
              width: '65%',
              animation: 'splashBar 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>

        {/* Loading status message */}
        <span className="text-xs text-gray-500 font-medium tracking-wide animate-pulse">
          {message}
        </span>
      </div>

      <style>{`
        @keyframes splashBar {
          0% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(50%); width: 75%; }
          100% { transform: translateX(200%); width: 40%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
