import React, { useState, useEffect } from 'react';
import { CensorshipOptions } from './CensorshipSelector';

interface CensoredPostWrapperProps {
  options: CensorshipOptions;
  children: React.ReactNode;
}

export default function CensoredPostWrapper({ options, children }: CensoredPostWrapperProps) {
  const [isRevealed, setIsRevealed] = useState(
    options.visualEffect === 'NONE' && options.interactionRule === 'NONE'
  );

  // Timer state
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isViewOnceSpent, setIsViewOnceSpent] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isTimerActive && timer === 0) {
      setIsRevealed(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // If no censorship is applied, just render children
  if (options.visualEffect === 'NONE' && options.interactionRule === 'NONE') {
    return <>{children}</>;
  }

  // If View Once is spent, hide content entirely
  if (isViewOnceSpent && !isRevealed) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg className="w-12 h-12 text-slate-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <p className="text-slate-700 font-medium">This content was marked as View Once and is no longer available.</p>
      </div>
    );
  }

  const handleRevealClick = () => {
    if (options.interactionRule === '15_SEC_TIMER') {
      if (!isTimerActive && timer > 0) {
        setIsTimerActive(true); // Start timer
      }
    } else {
      setIsRevealed(true);
    }
  };

  const handleCloseViewOnce = () => {
    setIsRevealed(false);
    setIsViewOnceSpent(true);
  };

  const hasTags = options.tags && options.tags.length > 0;

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Visual Tags Header (Always visible) */}
      {hasTags && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-t-lg border-b border-slate-300">
          {options.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-red-100 text-red-950 border border-red-400 font-bold text-xs  rounded">
              [{tag}]
            </span>
          ))}
          {!isRevealed && (
            <span className="text-xs text-slate-700 ml-auto self-center flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Content Restricted
            </span>
          )}
        </div>
      )}

      {/* Actual Content Wrapper */}
      <div className="relative">

        {/* The Content itself */}
        <div className={
          !isRevealed
            ? options.visualEffect === 'BLUR' ? 'blur-md opacity-40 select-none'
              : options.visualEffect === 'CENSOR_BAR' ? 'bg-black text-black select-none [&_*]:text-black'
                : options.visualEffect === 'INTERSTITIAL' ? 'hidden'
                  : 'opacity-50'
            : ''
        }>
          {children}
        </div>

        {/* The Overlay that blocks viewing */}
        {!isRevealed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/10 backdrop-blur-sm p-6 text-center">

            {options.visualEffect === 'INTERSTITIAL' && (
              <div className="bg-black/90 text-white p-8 rounded-xl max-w-sm mx-auto shadow-2xl mb-4">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Content Warning</h3>
                <p className="text-gray-300 text-sm mb-4">
                  The following content has been flagged by the creator or moderators as potentially sensitive.
                  {hasTags && ` Tags: ${options.tags.join(', ')}.`}
                </p>
                <p className="text-gray-400 text-xs italic">Viewer discretion is advised.</p>
              </div>
            )}

            {options.interactionRule === '15_SEC_TIMER' ? (
              <button
                onClick={handleRevealClick}
                disabled={isTimerActive && timer > 0}
                className={`px-6 py-2 rounded-full font-bold shadow-lg transition-all ${
                  isTimerActive
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
                }`}
              >
                {isTimerActive && timer > 0 ? `Deciphering in ${timer}s...` : 'Decipher Content'}
              </button>
            ) : options.interactionRule === 'VIEW_ONCE' ? (
              <button
                onClick={handleRevealClick}
                className="px-6 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Once
              </button>
            ) : (
              <button
                onClick={handleRevealClick}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-black rounded-full font-bold shadow-lg transition-transform hover:scale-105"
              >
                Click to Proceed
              </button>
            )}
          </div>
        )}

        {/* View Once active state indicator */}
        {isRevealed && options.interactionRule === 'VIEW_ONCE' && !isViewOnceSpent && (
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleCloseViewOnce}
              className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg hover:bg-red-700 animate-pulse"
            >
              Close & Destroy
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
