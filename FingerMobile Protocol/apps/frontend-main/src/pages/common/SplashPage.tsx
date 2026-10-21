import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 3 seconds total: 2s full opacity, 1s fade out
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, 2000);

    const redirectTimer = setTimeout(() => {
      navigate('/register');
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      style={{ opacity, transition: 'opacity 1s ease-in-out' }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    >
      <div className="text-4xl font-bold text-blue-600 mb-4 tracking-wider">
        FingerMobile
      </div>
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 text-sm">Loading security services (Guardian, Sentinel)...</p>
      </div>
    </div>
  );
};

export default SplashPage;
