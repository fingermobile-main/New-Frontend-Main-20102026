import React, {} from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Icon Factory Helper
 * Accepts up to 4 path strings to support multi-layer SVG icons.
 */
export const I = (d: string, d2?: string, d3?: string, d4?: string): React.FC<IconProps> => ({ className, ...p }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d2} />}
    {d3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d3} />}
    {d4 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d4} />}
  </svg>
);

// Add display name for ESLint compliance
I.displayName = 'IconFactory';
