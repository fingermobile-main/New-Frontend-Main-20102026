import React, { useState, useEffect } from 'react';

const BRANDING_IMAGES = [
  {
    src: '/assets/branding/general/FingerMobile Login screen.webp',
    fallbackSrc: '/assets/branding/auth/Sign In.webp',
    title: 'Sovereign Identity & High-Speed Rails',
    subtitle: 'Connecting users and enterprise systems securely across global networks.',
  },
  {
    src: '/assets/branding/general/Sign In.webp',
    fallbackSrc: '/assets/branding/auth/Login Sign in.webp',
    title: 'Stercs Studio & Infinite Coin',
    subtitle: 'Creator content monetization and instant cryptographic financial settlement.',
  },
  {
    src: '/assets/branding/general/register.webp',
    fallbackSrc: '/assets/branding/auth/register.webp',
    title: 'Share Moments, Build Communities',
    subtitle: 'Experience decentralized social, media streaming, and curated discovery.',
  },
  {
    src: '/assets/branding/general/FingerMobile Forgot password screen.webp',
    fallbackSrc: '/assets/branding/auth/FingerMobile Login screen.webp',
    title: 'Zero-Knowledge Security Vault',
    subtitle: 'Encrypted credentials, multi-factor hardware keys, and biometrics protection.',
  },
  {
    src: '/assets/branding/general/Login Sign in.webp',
    fallbackSrc: '/assets/branding/auth/FingerMobile Login screen.webp',
    title: 'Decentralized Sovereign Communications',
    subtitle: 'Real-time messaging, encrypted voice lines, and secure P2P micro-transactions.',
  },
];

interface AuthBrandingPanelProps {
  initialIndex?: number;
  className?: string;
}

export const AuthBrandingPanel: React.FC<AuthBrandingPanelProps> = ({ initialIndex, className = '' }) => {
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
    <div className={`hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-8 xl:p-12 overflow-hidden min-h-full border-r border-slate-800 ${className}`}>
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeImage.src}
          src={activeImage.src}
          alt="FingerMobile Platform"
          className="w-full h-full object-cover opacity-45 transition-opacity duration-1000 scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (activeImage.fallbackSrc && target.src !== activeImage.fallbackSrc) {
              target.src = activeImage.fallbackSrc;
            } else {
              target.style.display = 'none';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/40" />
      </div>

      {/* Brand Header with FingerMobile Official Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 flex items-center justify-center shadow-xl shadow-orange-500/10">
          <img
            src="/assets/branding/fingermobile/logo-orange.webp"
            alt="FingerMobile Logo"
            className="w-full h-full object-contain filter drop-shadow"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/branding/fingermobile/logo-white.webp';
            }}
          />
        </div>
        <div>
          <span className="text-white font-black text-lg xl:text-xl tracking-tight block">
            FingerMobile<span className="text-[#ff6b00]">™</span>
          </span>
          <span className="text-xs text-orange-400 font-bold block tracking-wider uppercase">
            Sovereign Communication Ecosystem
          </span>
        </div>
      </div>

      {/* Text Carousel Details */}
      <div className="relative z-10 space-y-4 max-w-md my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-extrabold tracking-wide">
          <span>Featured Ecosystem</span>
        </div>
        <h2 className="text-2xl xl:text-4xl font-black text-white leading-tight">
          {activeImage.title}
        </h2>
        <p className="text-sm xl:text-base text-slate-200 font-medium leading-relaxed">
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
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Legal / Version Marker */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-800/80 pt-4">
        <span>© 2026 GraceLink Business Technologies Group. Singapore</span>
        <span className="font-mono text-orange-400/90 font-bold">Infinite Coin Sovereign Rails v2.4</span>
      </div>
    </div>
  );
};

export default AuthBrandingPanel;
