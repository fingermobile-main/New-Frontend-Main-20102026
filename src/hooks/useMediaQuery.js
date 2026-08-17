import React, { useState, useEffect } from 'react';
// Custom hook for handling responsive design
// Hook to track screen size and device type
export const useMediaQuery = () => {
  const [deviceType, setDeviceType] = useState('desktop'); // desktop, tablet, mobile
  const [screenSize, setScreenSize] = useState({width: typeof window !== 'undefined' ? window.
  innerWidth : 0,
  height: typeof window !== 'undefined' ? window.
  innerHeight : 0
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    // Handler for screen size changes
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine device type based on screen width
      if (width <= 768) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Predefined breakpoints
  const breakpoints = {xs: 0,      // Extra small devices (phones, 0px and up),
  sm: 576,    // Small devices (landscape phones, 576px and up),
  md: 768,    // Medium devices (tablets, 768px and up),
  lg: 992,    // Large devices (desktops, 992px and up),
  xl: 1200,   // Extra large devices (large desktops, 1200px and up),
  xxl: 1400   // Extra extra large devices (larger desktops, 1400px and up)
  };

  // Helper functions to check if screen matches a breakpoint
  const isXs = screenSize.width >= breakpoints.xs && screenSize.width < breakpoints.sm;
  const isSm = screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md;
  const isMd = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isLg = screenSize.width >= breakpoints.lg && screenSize.width < breakpoints.xl;
  const isXl = screenSize.width >= breakpoints.xl && screenSize.width < breakpoints.xxl;
  const isXxl = screenSize.width >= breakpoints.xxl;

  // Function to check if screen is at least a certain size
  const isAtLeast = (size) => {
    const sizeValue = breakpoints[size];
    if (sizeValue === undefined) return false;
    return screenSize.width >= sizeValue;
  };

  // Function to check if screen is at most a certain size
  const isAtMost = (size) => {
    const sizeValue = breakpoints[size];
    if (sizeValue === undefined) return false;
    return screenSize.width <= sizeValue;
  };

  return {
    deviceType,
    screenSize,
    isTouchDevice,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    isAtLeast,
    isAtMost,
    breakpoints
  };
};

// Hook to determine orientation
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('');

  useEffect(() => {
    const handleOrientationChange = () => {
      const angle = window.screen.orientation?.angle || window.orientation;
      setOrientation(angle === 90 || angle === -90 ? 'landscape' : 'portrait');
    };

    // Initial call
    handleOrientationChange();

    // Add event listener
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    // Cleanup
    return () => {
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, []);

  return orientation;
};

// Hook to detect online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};