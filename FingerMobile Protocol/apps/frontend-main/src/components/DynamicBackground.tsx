import React, { useEffect, useState } from 'react';

interface BackgroundProps {
  imageUrl: string;
  disclaimer?: string;
  children?: React.ReactNode;
  holdMs?: number;
  durationMs?: number;
}

/**
 * DynamicBackground component
 * Auto-adjusts background opacity on load: holds full visual fidelity for 4 seconds (4,000ms),
 * with creator/platform disclaimer, then smoothly dissolves over a 4-second (4,000ms) transition
 * into the clean interface.
 */
export const DynamicBackground: React.FC<BackgroundProps> = ({
  imageUrl,
  disclaimer,
  children,
  holdMs = 4000,
  durationMs = 4000,
}) => {
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // 4-second initial display hold, then smooth 4-second fade-out transition
    const timer = setTimeout(() => setFade(true), holdMs);

    // Remove overlay layer after transition completes to preserve performance
    const cleanupTimer = setTimeout(() => setHidden(true), holdMs + durationMs + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
    };
  }, [holdMs, durationMs]);

  // Ensure image URLs with spaces or special characters are safely escaped for CSS url(...)
  const safeImageUrl = imageUrl ? encodeURI(decodeURI(imageUrl)) : '';

  return (
    <div className="relative w-full min-h-screen">
      {!hidden && (
        <div
          className={`fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-20 transition-opacity ease-in-out ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url("${safeImageUrl}")`,
            transitionDuration: `${durationMs}ms`,
          }}
          aria-hidden="true"
        />
      )}

      {disclaimer && !hidden && (
        <div
          className={`fixed bottom-3 right-3 max-w-sm text-right px-3.5 py-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-medium tracking-wide shadow-lg border border-white/10 z-30 pointer-events-none transition-opacity ease-in-out ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transitionDuration: `${durationMs}ms`,
          }}
        >
          {disclaimer}
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;
