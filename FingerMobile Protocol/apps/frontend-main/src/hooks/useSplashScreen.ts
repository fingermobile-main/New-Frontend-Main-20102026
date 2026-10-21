import { useEffect, useState } from 'react';

/**
 * useSplashScreen hook
 * Ensures the Splash Screen is displayed for 4 seconds ONLY (4,000ms)
 * to allow proper application bootstrapping, branding exposure, and smooth transition.
 */
export const useSplashScreen = (isAppReady: boolean = true, minDurationMs: number = 4000) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      if (isAppReady) {
        setShowSplash(false);
      }
    }, minDurationMs);

    return () => clearTimeout(minTimer);
  }, [isAppReady, minDurationMs]);

  return showSplash;
};

export default useSplashScreen;
