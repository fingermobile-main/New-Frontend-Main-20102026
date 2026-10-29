import React, { useState, useEffect } from 'react';

const BRANDING_IMAGES = [
  {
    src: '/branding/FingerMobile Login screen.webp',
    title: 'Sovereign Identity & High-Speed Rails',
    subtitle: 'Connecting users and enterprise systems securely across global networks.',
  },
  {
    src: '/branding/Sign In.webp',
    title: 'Stercs Studio & Infinite Coin',
    subtitle: 'Creator content monetization and instant cryptographic financial settlement.',
  },
  {
    src: '/branding/Success FingerMobile Join Us, Come Share Your Moments.webp',
    title: 'Share Moments, Build Communities',
    subtitle: 'Experience decentralized social, media streaming, and curated discovery.',
  },
  {
    src: '/branding/FingerMobile Forgot password screen.webp',
    title: 'Zero-Knowledge Security Vault',
    subtitle: 'Encrypted credentials, multi-factor hardware keys, and biometrics protection.',
  },
];

interface AuthBrandingPanelProps {
  initialIndex?: number;
}

export const AuthBrandingPanel: React.FC<AuthBrandingPanelProps> = ({ initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof initialIndex === 'number') return initialIndex % BRANDING_IMAGES.length;
    // Rotate automatically on each mount/session
    const saved = sessionStorage.getItem('fm_branding_rotation_index');
    const next = saved !== null ? (parseInt(saved, 10) + 1) % BRANDING_IMAGES.length : 0;
    sessionStorage.setItem('fm_branding_rotation_index', next.toString());
    return next;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRANDING_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeImage = BRANDING_IMAGES[currentIndex];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-10 overflow-hidden min-h-[640px] rounded-l-3xl border-r border-slate-800">
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeImage.src}
          src={activeImage.src}
          alt="FingerMobile Platform"
          className="w-full h-full object-cover opacity-40 transition-opacity duration-1000 scale-105"
          onError={(e) => {
            // Fallback to solid brand gradient if asset fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />
      </div>

      {/* Brand Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <span className="text-white font-black text-lg">FM</span>
        </div>
        <div>
          <span className="text-white font-black text-lg tracking-tight block">FingerMobile Protocol™</span>
          <span className="text-xs text-orange-400 font-semibold block">Sovereign Communication Ecosystem</span>
        </div>
      </div>

      {/* Text Carousel Details */}
      <div className="relative z-10 space-y-4 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
          <span>Featured Ecosystem</span>
        </div>
        <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight">
          {activeImage.title}
        </h2>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">
          {activeImage.subtitle}
        </p>

        {/* Rotation Dots */}
        <div className="flex items-center gap-2 pt-2">
          {BRANDING_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Switch to branding slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Legal / Version Marker */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-800/80 pt-4">
        <span>© 2026 GraceLink Business Technologies Group. Singapore</span>
        <span>FIC Sovereign Rails v2.4</span>
      </div>
    </div>
  );
};

export default AuthBrandingPanel;
