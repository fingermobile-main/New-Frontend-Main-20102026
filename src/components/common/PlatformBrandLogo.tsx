import React, { useState } from 'react';
import { PLATFORM_BRANDS, PlatformBrand } from '../../constants/ecosystemBranding';

export interface PlatformBrandLogoProps {
  brandKey: string;
  variant?: 'icon' | 'logo';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  alt?: string;
  showBadge?: boolean;
  showTitle?: boolean;
  linkToRoute?: boolean;
  onClick?: () => void;
}

const sizeClasses: Record<string, { icon: string; logo: string }> = {
  xs: { icon: 'w-5 h-5', logo: 'h-5 w-auto max-w-[80px]' },
  sm: { icon: 'w-7 h-7', logo: 'h-7 w-auto max-w-[120px]' },
  md: { icon: 'w-10 h-10', logo: 'h-10 w-auto max-w-[160px]' },
  lg: { icon: 'w-14 h-14', logo: 'h-14 w-auto max-w-[220px]' },
  xl: { icon: 'w-20 h-20', logo: 'h-20 w-auto max-w-[300px]' },
  custom: { icon: '', logo: '' }
};

export const PlatformBrandLogo: React.FC<PlatformBrandLogoProps> = ({
  brandKey,
  variant = 'icon',
  size = 'md',
  className = '',
  alt,
  showBadge = false,
  showTitle = false,
  linkToRoute = false,
  onClick
}) => {
  const brand: PlatformBrand | undefined = PLATFORM_BRANDS[brandKey.toLowerCase().replace(/[-_\s]/g, '')] || PLATFORM_BRANDS[brandKey];
  const [imageError, setImageError] = useState(false);

  if (!brand) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
        <span>{brandKey}</span>
      </div>
    );
  }

  const src = variant === 'icon' ? brand.iconUrl : brand.logoUrl;
  const currentSizeClass = sizeClasses[size]?.[variant] || '';

  const content = (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${linkToRoute ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 border border-slate-700/60 p-1 shadow-sm ${currentSizeClass}`}>
        {!imageError ? (
          <img
            src={src}
            alt={alt || brand.tagline || brand.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
            {brand.name.slice(0, 3)}
          </span>
        )}
      </div>

      {(showTitle || showBadge) && (
        <div className="flex flex-col min-w-0">
          {showTitle && (
            <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-orange-500 transition-colors">
              {brand.name}
            </span>
          )}
          {showBadge && (
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${brand.badgeColor} mt-0.5 inline-block w-fit`}>
              {brand.badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToRoute && brand.route) {
    return (
      <a href={brand.route} className="inline-flex items-center text-decoration-none">
        {content}
      </a>
    );
  }

  return content;
};

export default PlatformBrandLogo;
