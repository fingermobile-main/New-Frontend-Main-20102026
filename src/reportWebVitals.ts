import React from 'react';

const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals: any) => {
      if (webVitals.onCLS) {
        webVitals.onCLS(onPerfEntry);
        webVitals.onFCP?.(onPerfEntry);
        webVitals.onLCP?.(onPerfEntry);
        webVitals.onTTFB?.(onPerfEntry);
      } else if (webVitals.getCLS) {
        webVitals.getCLS(onPerfEntry);
        webVitals.getFCP?.(onPerfEntry);
        webVitals.getLCP?.(onPerfEntry);
        webVitals.getTTFB?.(onPerfEntry);
      }
    }).catch((error) => {
      console.error('Error importing web-vitals:', error);
    });
  }
};

export default reportWebVitals;
