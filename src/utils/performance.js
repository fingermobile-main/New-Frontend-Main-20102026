import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// Performance optimization utilities for the frontend
import { debounce as lodashDebounce } from 'lodash';

const LazyLoad = ({ children, fallback = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }),
    []
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [observer]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
};

LazyLoad.displayName = 'LazyLoad';

// Debounced callback hook (removed duplicate - keeping only the one with deps parameter)
export const useDebounceCallback = (callback, deps, delay = 300) => {
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback prop changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(
    () => lodashDebounce(
      (...args) => callbackRef.current(...args),
      delay
    ),
    [delay] // Only include delay in dependencies to avoid the spread element warning
  );

  return useCallback((...args) => {
    debouncedCallback(...args);
  }, [debouncedCallback]);
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', updatePosition);

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

const MemoizedComponent = ({ children, isEqual }) => {
  return children;
};

export { LazyLoad, useDebounceCallback, useScrollPosition, MemoizedComponent };

// Debounce function to limit function calls (renamed to avoid conflict with lodash)
export const debounceFn = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function to limit function calls over time
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image lazy loading utility
export const LazyImage = ({ src, alt, className, placeholder = '/placeholder.jpg', ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const imgRef = useRef();

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
  }, [src]);

  return <img ref={imgRef} src={imgSrc} alt={alt} className={className} {...props} />;
};

// Virtual scrolling helper
export const useVirtualScroll = (items, itemHeight, viewportHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(viewportHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    offsetY,
    startIndex,
    endIndex
  };
};

// Memory efficient large list renderer
export const createVirtualizedList = (Component, itemHeight, overscan = 5) => {
  const VirtualizedList = ({ items, containerHeight, ...props }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const totalHeight = items.length * itemHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return React.createElement(
      'div',
      {
        style: {
          height: containerHeight,
          overflow: 'scroll',
          position: 'relative'
        },
        onScroll: (e) => setScrollTop(e.target.scrollTop)
      },
      React.createElement('div', {
        style: {
          height: totalHeight,
          position: 'relative'
        }
      }),
      visibleItems.map((item, index) =>
        React.createElement(Component, {
          key: item.id || index,
          ...props,
          item,
          style: {
            position: 'absolute',
            top: offsetY + index * itemHeight,
            left: 0,
            width: '100%',
            height: itemHeight
          }
        })
      )
    );
  };

  VirtualizedList.displayName = 'VirtualizedList'; // Adding display name
  return VirtualizedList;
};

// Efficient data fetching with caching
export class DataCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.accessOrder = []; // Track access order for LRU
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end of access order (most recently used)
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(key);
      }
      return this.cache.get(key);
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used item
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value);
    this.accessOrder.push(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
}

// Custom hook for efficient state updates
export const useBatchState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  const batchUpdate = useCallback((updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  return [state, batchUpdate];
};

// Optimized re-render prevention
export const useMemoCompare = (next, compare) => {
  const previousRef = useRef();
  const nextRef = useRef();

  // Update nextRef each render
  nextRef.current = next;

  // Compare previous and next values using the compare function
  const isEqual = compare(previousRef.current, nextRef.current);

  // Update previousRef if values are not equal
  if (!isEqual) {
    previousRef.current = nextRef.current;
  }

  // Return the stable value
  return isEqual ? previousRef.current : nextRef.current;
};

// Performance monitoring utility
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.info(`⏱️,
Performance: ${name} - Execution,
time: ${(end - start).toFixed(2)} ms`);
  }

  return result;
};

// Image optimization utility
export const optimizeImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with quality
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Memory cleanup utility
export const useCleanup = (cleanupFn) => {
  useEffect(() => {
    return () => {
      cleanupFn();
    };
  }, [cleanupFn]);
};

// Efficient filtering utility
export const useFilteredData = (data, filterFn) => {
  return useMemo(() => data.filter(filterFn), [data, filterFn]);
};

// Efficient sorting utility
export const useSortedData = (data, sortFn) => {
  return useMemo(() => [...data].sort(sortFn), [data, sortFn]);
};
