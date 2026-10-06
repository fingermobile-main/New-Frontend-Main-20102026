import { useState, useEffect } from 'react';

export type BrandingScreenType = 'FORGOT_PASSWORD' | 'LOGIN' | 'ONBOARDING' | 'REGISTER' | 'SPLASH';

export interface BrandingAssetData {
  id?: string;
  screenType: BrandingScreenType;
  storageUrl: string;
  fileFormat?: string;
  ownerName: string;
  disclaimerText: string;
  trendingScore?: number;
  isActive?: boolean;
  holdMs?: number;
  durationMs?: number;
}

const BASELINE_FALLBACKS: Record<BrandingScreenType, BrandingAssetData> = {
  FORGOT_PASSWORD: {
    screenType: 'FORGOT_PASSWORD',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Forgot password.webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    holdMs: 4000,
    durationMs: 4000,
  },
  LOGIN: {
    screenType: 'LOGIN',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    holdMs: 4000,
    durationMs: 4000,
  },
  ONBOARDING: {
    screenType: 'ONBOARDING',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    holdMs: 4000,
    durationMs: 4000,
  },
  REGISTER: {
    screenType: 'REGISTER',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    holdMs: 4000,
    durationMs: 4000,
  },
  SPLASH: {
    screenType: 'SPLASH',
    storageUrl: '/assets/branding/fingermobile/FRONT copy.webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Splash Asset.',
    holdMs: 4000,
    durationMs: 4000,
  },
};

/**
 * Hook to retrieve active branding asset for the specified screen type.
 * Automatically synchronizes with /api/v1/branding/active, falling back to local WebP assets.
 */
export const useBrandingAsset = (screenType: BrandingScreenType): BrandingAssetData => {
  const [asset, setAsset] = useState<BrandingAssetData>(
    BASELINE_FALLBACKS[screenType] || BASELINE_FALLBACKS.LOGIN
  );

  useEffect(() => {
    let isMounted = true;

    fetch('/api/v1/branding/active')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success && data.data && data.data[screenType]) {
          setAsset(data.data[screenType]);
        }
      })
      .catch(() => {
        // Fallback remains the verified baseline
      });

    return () => {
      isMounted = false;
    };
  }, [screenType]);

  return asset;
};

export default useBrandingAsset;
