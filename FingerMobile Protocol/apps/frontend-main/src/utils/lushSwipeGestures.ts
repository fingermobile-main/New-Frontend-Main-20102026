import { useState, useRef, useEffect } from 'react';

interface SwipeGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
}

interface SwipeResult {
  direction: 'left' | 'right' | 'up' | 'down' | 'none';
  distance: number;
  velocity: number;
}

const MIN_SWIPE_DISTANCE = 50; // Minimum distance in pixels to register as a swipe
const MAX_SWIPE_TIME = 500; // Maximum time in ms to register as a swipe
const VELOCITY_THRESHOLD = 0.5; // Minimum velocity to register as a swipe

export const useSwipeGestures = () => {
  const [swipeStart, setSwipeStart] = useState<SwipeGesture | null>(null);
  const [swipeEnd, setSwipeEnd] = useState<SwipeGesture | null>(null);
  const [swipeResult, setSwipeResult] = useState<SwipeResult | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const gesture: SwipeGesture = {
      startX: touch.clientX,
      startY: touch.clientY,
      endX: touch.clientX,
      endY: touch.clientY,
      timestamp: Date.now()
    };

    setSwipeStart(gesture);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStart) return;

    const touch = e.touches[0];
    const updatedGesture: SwipeGesture = {
      ...swipeStart,
      endX: touch.clientX,
      endY: touch.clientY
    };

    setSwipeEnd(updatedGesture);
  };

  const handleTouchEnd = () => {
    if (!swipeStart || !swipeEnd) {
      setIsSwiping(false);
      return;
    }

    const result = calculateSwipeResult(swipeStart, swipeEnd);
    setSwipeResult(result);
    setIsSwiping(false);

    // Reset after processing
    setTimeout(() => {
      setSwipeStart(null);
      setSwipeEnd(null);
      setSwipeResult(null);
    }, 100);
  };

  const calculateSwipeResult = (start: SwipeGesture, end: SwipeGesture): SwipeResult => {
    const deltaX = end.endX - start.startX;
    const deltaY = end.endY - start.startY;
    const distanceX = Math.abs(deltaX);
    const distanceY = Math.abs(deltaY);
    const deltaTime = end.timestamp - start.timestamp;
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;

    // Determine primary direction based on greater distance moved
    if (distanceX > distanceY && distanceX > MIN_SWIPE_DISTANCE) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Right swipe
        return {
          direction: 'right',
          distance: distanceX,
          velocity: velocityX
        };
      } else {
        // Left swipe
        return {
          direction: 'left',
          distance: distanceX,
          velocity: velocityX
        };
      }
    } else if (distanceY > distanceX && distanceY > MIN_SWIPE_DISTANCE) {
      // Vertical swipe
      if (deltaY > 0) {
        // Down swipe
        return {
          direction: 'down',
          distance: distanceY,
          velocity: velocityY
        };
      } else {
        // Up swipe
        return {
          direction: 'up',
          distance: distanceY,
          velocity: velocityY
        };
      }
    } else {
      // No significant swipe detected
      return {
        direction: 'none',
        distance: Math.max(distanceX, distanceY),
        velocity: Math.max(velocityX, velocityY)
      };
    }
  };

  // Mouse-based swipe simulation for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const gesture: SwipeGesture = {
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY,
      timestamp: Date.now()
    };

    setSwipeStart(gesture);
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swipeStart) return;

    const updatedGesture: SwipeGesture = {
      ...swipeStart,
      endX: e.clientX,
      endY: e.clientY
    };

    setSwipeEnd(updatedGesture);
  };

  const handleMouseUp = () => {
    if (!swipeStart || !swipeEnd) {
      setIsSwiping(false);
      return;
    }

    const result = calculateSwipeResult(swipeStart, swipeEnd);
    setSwipeResult(result);
    setIsSwiping(false);

    // Reset after processing
    setTimeout(() => {
      setSwipeStart(null);
      setSwipeEnd(null);
      setSwipeResult(null);
    }, 100);
  };

  // Cleanup mouse listeners when not swiping
  useEffect(() => {
    if (isSwiping) {
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (swipeStart) {
          const updatedGesture: SwipeGesture = {
            ...swipeStart,
            endX: e.clientX,
            endY: e.clientY,
            timestamp: Date.now()
          };
          setSwipeEnd(updatedGesture);
        }
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isSwiping, swipeStart]);

  return {
    swipeResult,
    isSwiping,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    }
  };
};

// Utility function to determine swipe action based on result
export const determineSwipeAction = (result: SwipeResult, threshold: number = 0.7) => {
  if (result.direction === 'none') return 'none';

  // Consider both distance and velocity for a more reliable swipe detection
  const normalizedDistance = result.distance / 100; // Normalize distance to 0-1 scale
  const normalizedVelocity = Math.min(result.velocity, 1); // Cap velocity to 0-1 scale

  // Weighted combination of distance and velocity
  const confidence = (normalizedDistance * 0.6) + (normalizedVelocity * 0.4);

  if (confidence > threshold) {
    switch (result.direction) {
    case 'right':
      return 'like'; // Swipe right = like
    case 'left':
      return 'pass'; // Swipe left = pass
    case 'up':
      return 'super_like'; // Swipe up = super like
    case 'down':
      return 'report'; // Swipe down = report
    default:
      return 'none';
    }
  }

  return 'none';
};

// Hook to detect swipe gestures on a specific element
export const useElementSwipe = (elementRef: React.RefObject<HTMLElement>) => {
  const { swipeResult, isSwiping, handlers } = useSwipeGestures();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add event listeners to the element
    element.addEventListener('touchstart', handlers.onTouchStart as unknown as EventListener, { passive: false });
    element.addEventListener('touchmove', handlers.onTouchMove as unknown as EventListener, { passive: false });
    element.addEventListener('touchend', handlers.onTouchEnd as unknown as EventListener);

    // Mouse events for desktop
    element.addEventListener('mousedown', handlers.onMouseDown as unknown as EventListener);

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handlers.onTouchStart as unknown as EventListener);
        element.removeEventListener('touchmove', handlers.onTouchMove as unknown as EventListener);
        element.removeEventListener('touchend', handlers.onTouchEnd as unknown as EventListener);
        element.removeEventListener('mousedown', handlers.onMouseDown as unknown as EventListener);
      }
    };
  }, [elementRef, handlers]);

  return { swipeResult, isSwiping };
};
