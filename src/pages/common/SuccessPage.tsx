import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Ensure flags are persisted
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('hasCompletedOnboarding', 'true');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        u.onboardingComplete = true;
        u.onboarding_completed = true;
        localStorage.setItem('user', JSON.stringify(u));
        if (u.id) {
          localStorage.setItem(`onboardingComplete_${u.id}`, 'true');
        }
      } catch (_e) {
        // ignore parse error
      }
    }

    // 3 seconds total: 2s full opacity, 1s fade out
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, 2000);

    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      style={{ opacity, transition: 'opacity 1s ease-in-out' }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50 p-6 select-none"
    >
      <div className="flex flex-col items-center animate-fade-in text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
          FingerMobile
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-semibold text-sm mb-3 border border-green-200 dark:border-green-800">
          <span>✓</span>
          <span>Onboarding Completed Successfully</span>
        </div>
        <p className="text-slate-700 dark:text-gray-400 text-sm animate-pulse">
          Calibrating P2P services & preparing login experience...
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
