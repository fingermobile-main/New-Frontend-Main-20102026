import React, {} from 'react';

// Lazy loading component utility
export function lazyLoadComponent<P extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallbackComponent: React.ReactNode,
) {
  const LazyComponent = React.lazy(importFunc);

  // Return a function component that will render the lazy component
  const LazyLoadedComponent = React.forwardRef<React.Ref<unknown>, P>((props, ref) => {
    return (
      <React.Suspense fallback={fallbackComponent}>
        <LazyComponent {...props} ref={ref} />
      </React.Suspense>
    );
  });
  
  LazyLoadedComponent.displayName = 'LazyLoadedComponent';

  return LazyLoadedComponent;
}